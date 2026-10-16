'use client';

import React, { useState } from 'react';

interface StoreSosHubProps {
  showToast: (msg: string) => void;
}

export default function StoreSosHub({ showToast }: StoreSosHubProps) {
  const [sosVehicleType, setSosVehicleType] = useState<string>('All');
  const [sosEmergencyIssue, setSosEmergencyIssue] = useState<string>('all');
  const [sosLocationName, setSosLocationName] = useState<string>('Anna Salai, Guindy, Chennai • NH-45 Highway km 18');
  const [showSosDispatchModal, setShowSosDispatchModal] = useState<boolean>(false);
  const [selectedSosService, setSelectedSosService] = useState<{
    title: string;
    icon: string;
    time: string;
    price: string;
    categoryTag: string;
    desc: string;
    features: string[];
    assignedUnit: string;
    driverName: string;
    driverPhone: string;
  } | null>(null);
  const [sosDispatchStage, setSosDispatchStage] = useState<'finding' | 'assigned' | 'en_route'>('finding');

  return (
          <section className="hub-showcase-view sart-sos-view animate-pop">
            {/* TOP EMERGENCY RADAR HERO BANNER */}
            <div className="sart-sos-hero-card">
              <div className="sos-radar-header">
                <div className="sos-live-pill">
                  <span className="sos-blinking-dot"></span>
                  <span>24/7 LIVE EMERGENCY RESCUE ACTIVE • PAN-INDIA DISPATCH</span>
                </div>
                <div className="sos-hotline-badge">
                  <i className="fa-solid fa-phone-volume"></i>
                  <span>TOLL-FREE: <strong>1800-SART-SOS (7278-767)</strong></span>
                </div>
              </div>

              <div className="sos-hero-main-body">
                <div className="sos-hero-text">
                  <h2>Rapid Roadside Assistance (RSA) &amp; Vehicle Rescue</h2>
                  <p>
                    Stranded on a highway, caught in city traffic, or broken down at home? SART dispatches the nearest certified mechanic,
                    zero-damage hydraulic flatbed, emergency fuel unit, or mobile EV charging van within <strong>12 to 15 minutes</strong>.
                  </p>
                </div>

                <div className="sos-hero-cta-group">
                  <button
                    type="button"
                    className="sos-btn-primary-call"
                    onClick={() => {
                      showToast('Dialing 24/7 SART Emergency Rescue Desk: 1800-SART-SOS...');
                    }}
                  >
                    <i className="fa-solid fa-phone"></i>
                    <span>Call 24/7 Emergency Hotline</span>
                  </button>

                  <button
                    type="button"
                    className="sos-btn-primary-gps"
                    onClick={() => {
                      setSelectedSosService({
                        title: 'Rapid Emergency GPS Patrol Dispatch',
                        icon: 'fa-truck-medical',
                        time: '11 Mins Arrival',
                        price: '₹349 Visit Fee',
                        categoryTag: 'All Vehicles',
                        desc: 'Nearest SART highway patrol unit dispatched immediately to your live GPS coordinates.',
                        features: ['Nearest patrol van allocated', 'Real-time GPS track on map', 'On-spot diagnostic tools included', 'Cashless insurance claim integration'],
                        assignedUnit: 'Patrol Van #TN-09-RSA-412',
                        driverName: 'Murugan K. (4.9 ★ • 1,420+ Dispatches)',
                        driverPhone: '+91 98400 12345'
                      });
                      setSosDispatchStage('finding');
                      setShowSosDispatchModal(true);
                      setTimeout(() => setSosDispatchStage('assigned'), 1800);
                      setTimeout(() => setSosDispatchStage('en_route'), 3600);
                    }}
                  >
                    <i className="fa-solid fa-location-crosshairs"></i>
                    <span>One-Tap GPS Auto-Dispatch</span>
                  </button>

                  <button
                    type="button"
                    className="sos-btn-whatsapp"
                    onClick={() => {
                      showToast('Opening WhatsApp SOS Channel with SART Dispatch Controller...');
                    }}
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                    <span>WhatsApp SOS</span>
                  </button>
                </div>
              </div>

              {/* LIVE DETECTED LOCATION STRIP */}
              <div className="sos-location-live-strip">
                <div className="sos-loc-left">
                  <div className="loc-radar-icon">
                    <i className="fa-solid fa-satellite-dish"></i>
                  </div>
                  <div>
                    <span className="loc-sublabel">Your Detected Highway / City Location</span>
                    <strong className="loc-main-address">{sosLocationName}</strong>
                  </div>
                </div>
                <div className="sos-loc-right">
                  <div className="loc-nearest-badge">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Nearest Patrol Unit: <strong>2.4 km away</strong> (Est. 11 Mins)</span>
                  </div>
                  <button
                    type="button"
                    className="btn-change-gps-loc"
                    onClick={() => {
                      const updated = prompt('Enter your current highway mile-marker, landmark or city:', sosLocationName);
                      if (updated) {
                        setSosLocationName(updated);
                        showToast(`Location updated to: ${updated}`);
                      }
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i> Change Location
                  </button>
                </div>
              </div>
            </div>

            {/* VEHICLE TYPE FILTER BAR (ALL SART VEHICLES SUPPORTED) */}
            <div className="sos-filter-box">
              <div className="sos-filter-section-title">
                <i className="fa-solid fa-car"></i>
                <span>Select Your Stranded Vehicle Type:</span>
                <small className="sos-vtype-hint">(Tailors recovery trucks, hydraulic ramps &amp; equipment)</small>
              </div>

              <div className="sos-vtype-pills-row">
                {[
                  { id: 'All', label: 'All Vehicles', icon: 'fa-truck-monster' },
                  { id: 'Car', label: 'Car / SUV / MUV', icon: 'fa-car-side' },
                  { id: 'Bike', label: 'Bike / Scooter', icon: 'fa-motorcycle' },
                  { id: 'Auto', label: '3-Wheeler (Auto)', icon: 'fa-gas-pump' },
                  { id: 'Van', label: 'Commercial Van', icon: 'fa-van-shuttle' },
                  { id: 'Lorry', label: 'Heavy Truck / Lorry', icon: 'fa-truck-moving' },
                  { id: 'Bus', label: 'Bus / Coach', icon: 'fa-bus' },
                  { id: 'EV', label: 'Electric Vehicle (EV)', icon: 'fa-bolt' },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    className={`sos-vtype-btn ${sosVehicleType === v.id ? 'active' : ''}`}
                    onClick={() => {
                      setSosVehicleType(v.id);
                      showToast(`Filtered SOS assistance for: ${v.label}`);
                    }}
                  >
                    <i className={`fa-solid ${v.icon}`}></i>
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>

              {/* EMERGENCY ISSUE QUICK TRIAGE */}
              <div className="sos-filter-section-title" style={{ marginTop: '16px' }}>
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>What Is Your Emergency Situation?</span>
              </div>

              <div className="sos-triage-pills-row">
                {[
                  { id: 'all', label: 'All Emergency Services', icon: 'fa-layer-group' },
                  { id: 'breakdown', label: 'Engine Won\'t Start / Breakdown', icon: 'fa-wrench' },
                  { id: 'puncture', label: 'Flat Tyre / Puncture Swap', icon: 'fa-circle-dot' },
                  { id: 'battery', label: 'Dead Battery / Jumpstart', icon: 'fa-car-battery' },
                  { id: 'fuel_ev', label: 'Out of Fuel / EV Battery 0%', icon: 'fa-gas-pump' },
                  { id: 'towing', label: 'Accident / Towing Recovery', icon: 'fa-truck-pickup' },
                  { id: 'locked', label: 'Key Locked Inside Vehicle', icon: 'fa-key' },
                ].map((iss) => (
                  <button
                    key={iss.id}
                    type="button"
                    className={`sos-triage-btn ${sosEmergencyIssue === iss.id ? 'active' : ''}`}
                    onClick={() => setSosEmergencyIssue(iss.id)}
                  >
                    <i className={`fa-solid ${iss.icon}`}></i>
                    <span>{iss.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* EMERGENCY SERVICE CARDS GRID */}
            <div className="sos-cards-modern-grid">
              {[
                {
                  id: 'breakdown',
                  icon: 'fa-screwdriver-wrench',
                  title: 'On-Spot Mechanical Breakdown Repair',
                  time: '12 - 15 Mins Arrival',
                  price: '₹349 Visit Fee',
                  categoryTag: 'Cars, Bikes, Autos & Light Vans',
                  desc: 'Engine crank failure, overheating radiator, broken clutch/accelerator cable, spark plug failure, or minor electrical triage solved right on the highway.',
                  features: ['Comprehensive 25-point on-spot diagnosis', 'Alternator, belt & fuse replacement', 'Coolant top-up & air bleeding', 'Parts billed at standard OEM MRP'],
                  driverName: 'Murugan K. (4.9 ★ • 1,420+ Dispatches)',
                  driverPhone: '+91 98400 12345',
                  assignedUnit: 'Patrol Van #TN-09-RSA-412'
                },
                {
                  id: 'towing',
                  icon: 'fa-truck-pickup',
                  title: 'Hydraulic Flatbed & Crane Towing Recovery',
                  time: '18 - 20 Mins Arrival',
                  price: '₹999 Starting (First 25 km)',
                  categoryTag: 'Cars, SUVs, Bikes & Commercial Lorries',
                  desc: 'Zero-damage hydraulic full-tilt flatbeds for luxury sedans and SUVs, specialized ramp vans for two-wheelers, and high-tonnage underlift cranes for heavy trucks.',
                  features: ['Zero-ground clearance hydraulic tilt bed', 'Soft nylon wheel lashings (no rim scratches)', 'Cashless drop to nearest network garage', 'Live GPS in-app tracking during tow'],
                  driverName: 'Selvam R. (4.8 ★ • 980+ Tow Dispatches)',
                  driverPhone: '+91 98400 54321',
                  assignedUnit: 'Flatbed Recovery Truck #TN-07-TOW-881'
                },
                {
                  id: 'puncture',
                  icon: 'fa-circle-dot',
                  title: 'Tubeless Puncture & Rapid Wheel Swap',
                  time: '10 - 12 Mins Arrival',
                  price: '₹199 per Tyre',
                  categoryTag: 'All Vehicles (Cars, Bikes, Autos, Trucks)',
                  desc: 'High-speed mobile puncture repair unit. On-the-spot tubeless vulcanizing mushroom plug repair, stepney spare wheel mounting, and high-pressure digital nitrogen inflation.',
                  features: ['Heavy-duty 3-ton hydraulic jack', 'German tubeless vulcanized plug repair', 'Digital torque-wrench wheel tightening', 'Spare wheel swap & bead sealing'],
                  driverName: 'Vignesh P. (4.9 ★ • 2,100+ Punctures Repaired)',
                  driverPhone: '+91 98400 67890',
                  assignedUnit: 'Rapid Bike & Tyre Patrol #TN-01-RSA-109'
                },
                {
                  id: 'battery',
                  icon: 'fa-car-battery',
                  title: 'Emergency Battery Jumpstart & Replacement',
                  time: '12 - 15 Mins Arrival',
                  price: '₹299 Jumpstart',
                  categoryTag: '12V Passenger & 24V Heavy Commercial Fleet',
                  desc: 'Heavy-duty 1000A booster pack for instant jumpstart. Digital load testing of battery, alternator, and starter motor. On-spot Amaron / Exide battery delivery available.',
                  features: ['12V & 24V surge-protected jumpstart', 'Computerized alternator health test', 'Doorstep Amaron / Exide replacement available', 'Old battery exchange discount up to ₹1,200'],
                  driverName: 'Karthik S. (4.9 ★ • 850+ Battery Dispatches)',
                  driverPhone: '+91 98400 99887',
                  assignedUnit: 'Battery Support Unit #TN-09-BAT-304'
                },
                {
                  id: 'fuel_ev',
                  icon: 'fa-gas-pump',
                  title: 'Emergency Fuel & Mobile EV Fast Charger',
                  time: '15 Mins Arrival',
                  price: '₹249 Delivery + Fuel / ₹699 EV Top-up',
                  categoryTag: 'Petrol, Diesel & EV Vehicles',
                  desc: 'Ran out of fuel or EV battery drained to 0%? 5 to 10 Litres of certified pure Petrol/Diesel delivered in sealed PESO-approved cans, or mobile 25 kW DC fast charger van top-up.',
                  features: ['5L pure Petrol or Diesel in PESO cans', 'Mobile DC fast charger (adds 20-30 km range in 15 mins)', 'Diesel fuel line priming & air-lock bleeding', 'Zero contamination guarantee'],
                  driverName: 'Aravind M. (4.8 ★ • 1,120+ Fuel Rescues)',
                  driverPhone: '+91 98400 11223',
                  assignedUnit: 'Mobile Fuel & EV Van #TN-02-EV-550'
                },
                {
                  id: 'towing',
                  icon: 'fa-car-burst',
                  title: 'Accident Triage, Winch & Insurance Garage Drop',
                  time: 'Immediate (Priority 1)',
                  price: '100% Free Triage Help',
                  categoryTag: 'Cashless Network for All Vehicles',
                  desc: 'Accident recovery specialists. On-scene documentation, FIR and police liaison guidance, zero-damage winching out of ditches or dividers, and cashless transport to authorized body shop.',
                  features: ['Spot survey & high-res damage photography', 'Assistance with police FIR & highway protocol', 'Direct transfer to 28+ cashless insurance workshops', 'Zero out-of-pocket towing under RSA policy'],
                  driverName: 'Dinesh Kumar (Accident Triage Commander)',
                  driverPhone: '+91 98400 44556',
                  assignedUnit: 'Heavy Winch Crane Unit #TN-09-REC-901'
                },
                {
                  id: 'locked',
                  icon: 'fa-key',
                  title: 'Smart Key Lockout & Non-Destructive Entry',
                  time: '15 - 20 Mins Arrival',
                  price: '₹449 Fixed Fee',
                  categoryTag: 'Cars, SUVs, Commercial Vans & Trucks',
                  desc: 'Keys locked inside the car or trunk? Certified locksmith technicians use professional air-wedge airbags and scratch-free reach rods to unlock doors without damaging paint or rubber seals.',
                  features: ['100% non-destructive air wedge entry', 'Zero scratch guarantee on glass & paint', 'Smart key fob battery replacement on spot', 'Valid vehicle RC & ID verification required'],
                  driverName: 'Ramesh Babu (Lockout Specialist)',
                  driverPhone: '+91 98400 77889',
                  assignedUnit: 'Rapid Lockout Patrol #TN-01-KEY-007'
                },
                {
                  id: 'breakdown',
                  icon: 'fa-truck-moving',
                  title: 'Heavy Commercial Lorry & Bus Fleet SOS',
                  time: '20 - 25 Mins Arrival',
                  price: 'Custom Fleet Corporate Tariff',
                  categoryTag: 'Lorries, Trailers, Multi-Axle Trucks & Buses',
                  desc: 'Highway long-haul emergency assistance for transport fleet operators. Air brake pneumatic hose repair, heavy wheel nut torquing, propeller shaft recovery, and 40-ton crane rescue.',
                  features: ['Heavy pneumatic impact wrenches & jacks', 'Trailer kingpin & air brake diagnostics', 'Heavy underlift towing for 16-to-40 ton trucks', 'Driver highway food & safety assistance'],
                  driverName: 'Rajendran M. (Heavy Fleet Recovery Lead)',
                  driverPhone: '+91 98400 33221',
                  assignedUnit: 'Heavy Fleet 40T Recovery Rig #TN-04-CRANE-99'
                }
              ]
                .filter((srv) => {
                  if (sosEmergencyIssue !== 'all' && srv.id !== sosEmergencyIssue) return false;
                  return true;
                })
                .map((srv) => (
                  <div key={srv.title} className="sos-modern-card">
                    <div className="sos-card-header-bar">
                      <div className="sos-badge-eta">
                        <i className="fa-solid fa-bolt"></i>
                        <span>{srv.time}</span>
                      </div>
                      <span className="sos-tag-vehicles">{srv.categoryTag}</span>
                    </div>

                    <div className="sos-card-middle">
                      <div className="sos-icon-circle">
                        <i className={`fa-solid ${srv.icon}`}></i>
                      </div>
                      <div className="sos-title-block">
                        <h4>{srv.title}</h4>
                        <p className="sos-desc-text">{srv.desc}</p>
                      </div>
                    </div>

                    <ul className="sos-features-checklist">
                      {srv.features.map((feat, i) => (
                        <li key={i}>
                          <i className="fa-solid fa-circle-check"></i>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="sos-card-bottom-bar">
                      <div className="sos-price-box">
                        <span className="sos-price-label">Transparent Tariff</span>
                        <strong className="sos-price-value">{srv.price}</strong>
                      </div>
                      <button
                        type="button"
                        className="btn-sos-card-dispatch"
                        onClick={() => {
                          setSelectedSosService(srv);
                          setSosDispatchStage('finding');
                          setShowSosDispatchModal(true);
                          setTimeout(() => setSosDispatchStage('assigned'), 1800);
                          setTimeout(() => setSosDispatchStage('en_route'), 3600);
                        }}
                      >
                        <i className="fa-solid fa-truck-fast"></i>
                        <span>Dispatch Now</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* HIGHWAY EMERGENCY PROTOCOL (SAFETY STEPS WHILE WAITING) */}
            <div className="sos-safety-protocol-section">
              <div className="sos-section-header">
                <h3><i className="fa-solid fa-shield-halved"></i> Highway Emergency Safety Protocol</h3>
                <p>Follow these critical guidelines to stay 100% safe while our patrol unit reaches your vehicle.</p>
              </div>

              <div className="sos-safety-grid">
                <div className="sos-safety-card">
                  <div className="safety-icon warn">
                    <i className="fa-solid fa-lightbulb"></i>
                  </div>
                  <h5>1. Hazard Lights On</h5>
                  <p>Turn on your hazard warning flashers immediately to alert speeding highway vehicles from behind.</p>
                </div>

                <div className="sos-safety-card">
                  <div className="safety-icon danger">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <h5>2. Warning Triangle 50m Back</h5>
                  <p>Place your reflective red warning triangle at least 50 meters behind your vehicle on the highway shoulder.</p>
                </div>

                <div className="sos-safety-card">
                  <div className="safety-icon safe">
                    <i className="fa-solid fa-person-shelter"></i>
                  </div>
                  <h5>3. Stand Behind Barrier</h5>
                  <p>Never sit inside the vehicle on a high-speed motorway. Move all passengers safely behind the steel crash barrier.</p>
                </div>

                <div className="sos-safety-card">
                  <div className="safety-icon police">
                    <i className="fa-solid fa-headset"></i>
                  </div>
                  <h5>4. Emergency 112 &amp; 1033 Sync</h5>
                  <p>SART dispatch auto-syncs with National Highway Emergency (1033) &amp; Police 112 if you request armed assistance.</p>
                </div>
              </div>
            </div>

            {/* SART RSA FLEET COMMITMENTS & CASHLESS PARTNERS */}
            <div className="sos-guarantee-strip">
              <div className="guarantee-item">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <div>
                  <strong>15-Minute Highway Commitment</strong>
                  <span>Fastest average response time on 98% of Indian National &amp; State Highways.</span>
                </div>
              </div>
              <div className="guarantee-item">
                <i className="fa-solid fa-shield-check"></i>
                <div>
                  <strong>Zero-Damage Recovery Guarantee</strong>
                  <span>Hydraulic low-angle tilt beds protect bumpers, differentials, and alloy rims.</span>
                </div>
              </div>
              <div className="guarantee-item">
                <i className="fa-solid fa-file-invoice-dollar"></i>
                <div>
                  <strong>28+ Cashless Insurer Partners</strong>
                  <span>Direct cashless claim billing with ICICI Lombard, HDFC Ergo, Tata AIG, Bajaj Allianz &amp; more.</span>
                </div>
              </div>
              <div className="guarantee-item">
                <i className="fa-solid fa-person-dress"></i>
                <div>
                  <strong>Female Motorist Priority Escort</strong>
                  <span>Police-verified background-checked technicians with automated family live-location tracking.</span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE LIVE SOS DISPATCH MODAL */}
            {showSosDispatchModal && selectedSosService && (
              <div className="sos-modal-overlay animate-fade">
                <div className="sos-modal-box animate-pop">
                  <div className="sos-modal-header">
                    <div className="sos-modal-title">
                      <div className="sos-beacon-pulse"></div>
                      <div>
                        <h3>Live Emergency Dispatch Tracking</h3>
                        <span className="sos-order-ref">Request ID: #SART-SOS-98124 • Priority Level: CRITICAL</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="sos-modal-close-btn"
                      onClick={() => setShowSosDispatchModal(false)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>

                  <div className="sos-modal-body">
                    {/* DISPATCH PROGRESS RADAR */}
                    <div className="sos-tracker-radar-panel">
                      <div className="radar-circle-anim">
                        <div className="radar-sweep"></div>
                        <i className="fa-solid fa-truck-medical radar-center-icon"></i>
                      </div>
                      <div className="radar-status-info">
                        <span className="radar-tag">
                          {sosDispatchStage === 'finding' && 'SEARCHING NEAREST PATROL UNIT...'}
                          {sosDispatchStage === 'assigned' && 'PATROL OFFICER ALLOCATED!'}
                          {sosDispatchStage === 'en_route' && 'PATROL VEHICLE EN ROUTE VIA GPS!'}
                        </span>
                        <h4>{selectedSosService.title}</h4>
                        <p className="radar-loc-txt">
                          <i className="fa-solid fa-location-dot"></i> Destination: {sosLocationName}
                        </p>
                      </div>
                    </div>

                    {/* DRIVER & VEHICLE DETAILS */}
                    <div className="sos-driver-card">
                      <div className="driver-avatar-box">
                        <i className="fa-solid fa-user-shield"></i>
                      </div>
                      <div className="driver-details">
                        <div className="driver-name-row">
                          <strong>{selectedSosService.driverName}</strong>
                          <span className="driver-badge">VERIFIED SART RESPONDER</span>
                        </div>
                        <span className="driver-sub">{selectedSosService.assignedUnit}</span>
                        <div className="driver-specs">
                          <span><i className="fa-solid fa-toolbox"></i> Fully Equipped RSA Unit</span>
                          <span><i className="fa-solid fa-route"></i> Distance: 2.4 km away</span>
                        </div>
                      </div>
                      <div className="driver-eta-box">
                        <span className="eta-lbl">EST. ARRIVAL</span>
                        <strong className="eta-val">11 MINS</strong>
                      </div>
                    </div>

                    {/* TIMELINE STEPS */}
                    <div className="sos-timeline-steps">
                      <div className="timeline-step completed">
                        <div className="step-circle"><i className="fa-solid fa-check"></i></div>
                        <div className="step-content">
                          <strong>SOS Request Received &amp; GPS Locked</strong>
                          <small>Coordinates verified by Chennai Highway Dispatch Desk</small>
                        </div>
                      </div>

                      <div className={`timeline-step ${sosDispatchStage === 'assigned' || sosDispatchStage === 'en_route' ? 'completed' : 'active'}`}>
                        <div className="step-circle">
                          {sosDispatchStage === 'finding' ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check"></i>}
                        </div>
                        <div className="step-content">
                          <strong>Unit #412 Dispatched from Guindy RSA Depot</strong>
                          <small>Technician rolling with hydraulic gear, booster pack &amp; tyre kit</small>
                        </div>
                      </div>

                      <div className={`timeline-step ${sosDispatchStage === 'en_route' ? 'active' : ''}`}>
                        <div className="step-circle">
                          {sosDispatchStage === 'en_route' ? <i className="fa-solid fa-location-arrow"></i> : <i className="fa-solid fa-circle"></i>}
                        </div>
                        <div className="step-content">
                          <strong>Patrol Unit Approaching Your Vehicle</strong>
                          <small>Keep your hazard lights flashing for rapid visual identification</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MODAL FOOTER ACTIONS */}
                  <div className="sos-modal-footer">
                    <button
                      type="button"
                      className="btn-modal-call-driver"
                      onClick={() => showToast(`Dialing Patrol Driver (${selectedSosService.driverPhone})...`)}
                    >
                      <i className="fa-solid fa-phone"></i>
                      <span>Call Patrol Driver</span>
                    </button>

                    <button
                      type="button"
                      className="btn-modal-share-loc"
                      onClick={() => showToast('Live GPS location shared via WhatsApp to Emergency Contacts!')}
                    >
                      <i className="fa-brands fa-whatsapp"></i>
                      <span>Share Location With Family</span>
                    </button>

                    <button
                      type="button"
                      className="btn-modal-close"
                      onClick={() => {
                        setShowSosDispatchModal(false);
                        showToast('Dispatch modal closed. Live tracking continues in background.');
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

          </section>
  );
}
