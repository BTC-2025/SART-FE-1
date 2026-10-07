// ============================================================================
// SART Universal Transport Booking Web Application Controller (app.js)
// ============================================================================

// ----------------------------------------------------------------------------
// 1. STATE INITIALIZATION & LOCALSTORAGE MANAGEMENT
// ----------------------------------------------------------------------------
const DEFAULT_STATE = {
  wallet: {
    balance: 15000.00,
    points: 2450,
    cashback: 350.00,
    transactions: [
      { id: 'tx-001', title: 'Airport Taxi Booking', amount: 800.00, date: new Date(Date.now() - 7200000).toLocaleString(), isCredit: false, category: 'Ride' },
      { id: 'tx-002', title: 'Tire Air Replacement Kit', amount: 3500.00, date: new Date(Date.now() - 86400000).toLocaleString(), isCredit: false, category: 'Store' },
      { id: 'tx-003', title: 'Visa Top-up Loaded', amount: 10000.00, date: new Date(Date.now() - 172800000).toLocaleString(), isCredit: true, category: 'Deposit' }
    ]
  },
  bookings: [
    {
      id: 'bk-001',
      title: 'Tata Nexon EV Rental',
      type: 'rental',
      dateTime: new Date(Date.now() + 172800000).toLocaleString(),
      details: 'Pickup: 10:00 AM • 3 Days Duration',
      status: 'Active',
      cost: 4500.00
    },
    {
      id: 'bk-002',
      title: 'Tire Diagnostics & Balance',
      type: 'mechanic',
      dateTime: new Date(Date.now() - 259200000).toLocaleString(),
      details: 'Assigned: Rajesh Kumar • Completed',
      status: 'Completed',
      cost: 1200.00
    }
  ],
  cart: [],
  wishlist: [],
  notifications: [
    { id: 'notif-1', title: 'Gold Tier Perks Unlocked!', desc: 'Enjoy free airport terminal lounge access & priority dispatch.', read: false, date: 'Today' },
    { id: 'notif-2', title: 'EV Battery Status Optimized', desc: 'Tata Nexon EV charge finished cycle. Ready for commutes.', read: false, date: 'Yesterday' },
    { id: 'notif-3', title: 'Toll Refund Processed', desc: '₹120 refund credited for NH-44 Fastag anomaly.', read: true, date: '3 days ago' }
  ],
  location: "Chennai",
  activeBookingId: null
};

let appState = {};

function loadState() {
  const saved = localStorage.getItem('sart_web_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      appState = { ...JSON.parse(JSON.stringify(DEFAULT_STATE)), ...parsed };
      // Also merge nested wallet object safely
      if (!appState.wallet) {
        appState.wallet = JSON.parse(JSON.stringify(DEFAULT_STATE.wallet));
      } else {
        appState.wallet = { ...DEFAULT_STATE.wallet, ...appState.wallet };
      }
    } catch (e) {
      console.error("Failed to parse localstorage state, loading default.", e);
      appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  } else {
    appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}

function saveState() {
  localStorage.setItem('sart_web_state', JSON.stringify(appState));
  updateUI();
}

// ----------------------------------------------------------------------------
// 2. PRODUCT DATABASE & MOCK DATA
// ----------------------------------------------------------------------------
const AUTO_PRODUCTS = [
  {
    id: 'st-001',
    name: 'AI Smart Dash Pro',
    price: 4990.00,
    rating: '4.9',
    icon: 'fa-terminal',
    category: 'Smart Upgrades',
    desc: 'High-fidelity dual-lens dashcam with real-time AI object detection, lane departure warnings, and parking guard telemetry linked straight to your phone.'
  },
  {
    id: 'st-002',
    name: 'OBD2 Diagnostics Scanner',
    price: 1190.00,
    rating: '4.7',
    icon: 'fa-gauge',
    category: 'Diagnostics',
    desc: 'Premium hardware scanner reading real-time engine telemetry, transmission codes, battery capacity status, and emission logs.'
  },
  {
    id: 'st-003',
    name: 'Carbon Fiber Trim Kit',
    price: 2490.00,
    rating: '4.8',
    icon: 'fa-chess-board',
    category: 'Accessories',
    desc: 'Genuine carbon styling wrap with sweat-resistant grips. Snug fit on standard sports dash panels.'
  },
  {
    id: 'st-004',
    name: 'LED Sports Headlamps',
    price: 1890.00,
    rating: '4.6',
    icon: 'fa-lightbulb',
    category: 'Lighting',
    desc: 'High intensity illumination bulbs delivering 200% brighter beams for safer night cruises and highway route previews.'
  }
];

const AUTO_NEWS = [
  { id: 'news-1', title: 'Solid-State Batteries to Enter Small Scale Production by 2027', source: 'Auto Future Digest', date: 'Today', tag: 'EV Tech', desc: 'Multiple battery startups have announced pilot manufacturing lanes for solid-state cells designed for electric vehicles. This technology promises double the energy density of current lithium-ion batteries.', img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938cb?auto=format&fit=crop&w=150&q=80' },
  { id: 'news-2', title: 'New Dynamic Toll Rates Planned for Metro Expressways', source: 'City Transit Council', date: 'Yesterday', tag: 'Regulation', desc: 'Starting next month, expressway toll rates will adjust dynamically based on live traffic densities. City planners aim to reduce bottleneck congestion.', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=150&q=80' },
  { id: 'news-3', title: 'Luxury Yachts: Trends for the Upcoming Sea Ride Season', source: 'Marine World', date: '3 days ago', tag: 'Sea Design', desc: 'Yacht styling is taking cues from modern cyber-punk aesthetics, featuring carbon fibre paneling, integrated diagnostic displays, and smart autopilot systems.', img: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=150&q=80' }
];

// Current pricing selections for modals
let activeSelectionPrices = {
  'modal-ride': 800,
  'modal-carrier': 3500,
  'modal-rental': 4500,
  'modal-drivers': 1200,
  'modal-parking': 150,
  'modal-mechanic': 1200,
  'modal-sea': 600,
  'modal-air': 4500,
  'modal-train': 850
};

let activeSelectionTiers = {
  'modal-ride': 'Economy Sedan',
  'modal-carrier': 'Mini Cargo Van',
  'modal-rental': 'Tata Nexon EV',
  'modal-drivers': 'Short Commute Driver',
  'modal-parking': 'Standard Slot',
  'modal-mechanic': 'Diagnostics & Check',
  'modal-sea': 'Ferry Speedliner',
  'modal-air': 'Commercial Economy',
  'modal-train': 'Vande Bharat AC Chair'
};

// ----------------------------------------------------------------------------
// 3. CORE ROUTER & PAGE NAVIGATOR
// ----------------------------------------------------------------------------
let currentTab = 'home';

function switchTab(tabId) {
  currentTab = tabId;
  
  // Update nav UI active class (navbar links)
  document.querySelectorAll('.nav-link').forEach(item => {
    item.classList.remove('active');
  });
  
  const navBtn = document.getElementById(`nav-btn-${tabId}`);
  if (navBtn) navBtn.classList.add('active');
  
  // Hide all screens, show requested screen
  document.querySelectorAll('.tab-screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  const targetScreen = document.getElementById(`tab-${tabId}`);
  if (targetScreen) targetScreen.classList.add('active');
  
  logActivity(`System`, `Switched active tab section viewport to [${tabId.toUpperCase()}]`);

  // Specific tab initializations
  if (tabId === 'home') {
    // Re-trigger Leaflet map resize
    setTimeout(() => {
      if (leafletMap) {
        leafletMap.invalidateSize();
        recenterMap();
      }
    }, 200);
  }
}

// ----------------------------------------------------------------------------
// 4. LEAFLET MAP & ANIMATED ROUTING SYSTEM
// ----------------------------------------------------------------------------
let leafletMap = null;
let userMarker = null;
let nearbyMarkers = [];
let routingPolyline = null;
let animatedVehicleMarker = null;
let animationIntervalId = null;

const BENGALURU_COORDS = [12.9716, 77.5946];

function initMap() {
  try {
    // Set up Leaflet map
    leafletMap = L.map('explore-map', {
      zoomControl: false,
      attributionControl: false
    }).setView(BENGALURU_COORDS, 14);

    // Standard OpenStreetMap tiles for a realistic look
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap);

    // Custom pulse icon for user location
    const userPulseIcon = L.divIcon({
      className: 'user-gps-pulse',
      html: `<div style="width: 14px; height: 14px; background: var(--primary); border: 2px solid #fff; border-radius: 50%; box-shadow: 0 0 10px var(--primary); position: relative;">
              <div style="position: absolute; width: 34px; height: 34px; border: 2px solid var(--primary); border-radius: 50%; left: -12px; top: -12px; opacity: 0.5; animation: pulseRed 1.5s infinite alternate;"></div>
             </div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    userMarker = L.marker(BENGALURU_COORDS, { icon: userPulseIcon }).addTo(leafletMap);
    
    // Generate nearby mock transport vehicles, parking, mechanics
    generateNearbyHotspots();
    
    logActivity(`System`, `Leaflet map engine initialized with Dark Matter tiles`);
  } catch (error) {
    console.error("Map loading error", error);
    logActivity(`Error`, `Could not load map viewport CDN resources.`);
  }
}

function generateNearbyHotspots() {
  if (!leafletMap) return;
  // Clear existing
  nearbyMarkers.forEach(m => leafletMap.removeLayer(m));
  nearbyMarkers = [];

  const icons = {
    taxi: `<i class="fa-solid fa-car" style="color: var(--primary); font-size: 13px;"></i>`,
    rental: `<i class="fa-solid fa-key" style="color: var(--accent); font-size: 12px;"></i>`,
    parking: `<i class="fa-solid fa-square-p" style="color: #8b5cf6; font-size: 13px;"></i>`
  };

  // Generate 8 random points around user coords
  const categories = ['taxi', 'rental', 'parking'];
  for (let i = 0; i < 8; i++) {
    const latOffset = (Math.random() - 0.5) * 0.015;
    const lngOffset = (Math.random() - 0.5) * 0.015;
    const cat = categories[Math.floor(Math.random() * categories.length)];
    
    const lat = BENGALURU_COORDS[0] + latOffset;
    const lng = BENGALURU_COORDS[1] + lngOffset;

    const customIcon = L.divIcon({
      className: 'map-spot-marker',
      html: `<div style="width: 28px; height: 28px; background: var(--panel-bg); border: 1.5px solid var(--card-border); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
              ${icons[cat]}
             </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(leafletMap);
    nearbyMarkers.push(marker);
  }
}

function recenterMap() {
  if (leafletMap && userMarker) {
    leafletMap.setView(userMarker.getLatLng(), 14, { animate: true });
    logActivity("System", "Recenter GPS viewport");
  }
}

function zoomInMap() {
  if (leafletMap) leafletMap.zoomIn();
}
function zoomOutMap() {
  if (leafletMap) leafletMap.zoomOut();
}

function toggleMapHotspots() {
  generateNearbyHotspots();
  logActivity(`System`, `Refreshed nearby drivers & charging nodes on map`);
}

// Animated trip route visualizer
function animateActiveBookingRoute(bookingTitle, type) {
  if (!leafletMap) return;

  // Clear existing routing
  if (routingPolyline) leafletMap.removeLayer(routingPolyline);
  if (animatedVehicleMarker) leafletMap.removeLayer(animatedVehicleMarker);
  if (animationIntervalId) clearInterval(animationIntervalId);

  // Define route endpoint
  const start = BENGALURU_COORDS;
  let end = [start[0] + 0.012, start[1] + 0.018];
  
  if (type === 'sea') {
    end = [start[0] - 0.02, start[1] - 0.01];
  } else if (type === 'air') {
    end = [start[0] + 0.035, start[1] + 0.025];
  } else if (type === 'train') {
    end = [start[0] - 0.015, start[1] + 0.03];
  }

  // Draw Route Polyline
  const routePoints = [start];
  
  const segments = 10;
  for (let i = 1; i < segments; i++) {
    const ratio = i / segments;
    const intermediateLat = start[0] + (end[0] - start[0]) * ratio + (Math.random() - 0.5) * 0.002;
    const intermediateLng = start[1] + (end[1] - start[1]) * ratio + (Math.random() - 0.5) * 0.002;
    routePoints.push([intermediateLat, intermediateLng]);
  }
  routePoints.push(end);

  routingPolyline = L.polyline(routePoints, {
    color: 'var(--primary)',
    weight: 4,
    opacity: 0.7,
    dashArray: '8, 8',
    lineJoin: 'round'
  }).addTo(leafletMap);

  leafletMap.fitBounds(routingPolyline.getBounds(), { padding: [40, 40] });

  let vehicleIconClass = 'fa-car-side';
  let vehicleColor = 'var(--primary)';
  if (type === 'sea') { vehicleIconClass = 'fa-ship'; vehicleColor = 'var(--success)'; }
  else if (type === 'air') { vehicleIconClass = 'fa-plane'; vehicleColor = 'var(--warning)'; }
  else if (type === 'train') { vehicleIconClass = 'fa-train'; vehicleColor = '#c864ff'; }

  const animIcon = L.divIcon({
    className: 'moving-car-icon',
    html: `<div style="width: 32px; height: 32px; background: ${vehicleColor}; border: 2px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${vehicleColor};">
            <i class="fa-solid ${vehicleIconClass}" style="color: #fff; font-size: 14px;"></i>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  animatedVehicleMarker = L.marker(start, { icon: animIcon }).addTo(leafletMap);

  let currentStep = 0;
  animationIntervalId = setInterval(() => {
    if (currentStep >= routePoints.length) {
      currentStep = 0;
    }
    const nextCoords = routePoints[currentStep];
    animatedVehicleMarker.setLatLng(nextCoords);
    
    const bookingCardDesc = document.getElementById('map-active-booking-desc');
    if (bookingCardDesc) {
      if (currentStep === 0) {
        bookingCardDesc.innerText = "Transit starting • Live Tracking";
      } else if (currentStep === routePoints.length - 1) {
        bookingCardDesc.innerText = "Arrived! Trip completed.";
        logActivity(`Bookings`, `Live active trip [${bookingTitle}] has completed.`);
        clearInterval(animationIntervalId);
      } else {
        const percent = Math.round((currentStep / (routePoints.length - 1)) * 100);
        bookingCardDesc.innerText = `In Transit • ${percent}% completed`;
      }
    }

    currentStep++;
  }, 1800);
}

function clearMapRoutingAnimation() {
  if (routingPolyline && leafletMap) leafletMap.removeLayer(routingPolyline);
  if (animatedVehicleMarker && leafletMap) leafletMap.removeLayer(animatedVehicleMarker);
  if (animationIntervalId) clearInterval(animationIntervalId);
  
  routingPolyline = null;
  animatedVehicleMarker = null;
}

// ----------------------------------------------------------------------------
// 5. MODAL LOGIC & ACTIONS
// ----------------------------------------------------------------------------
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    logActivity(`System`, `Opened panel [${modalId.replace('modal-', '').toUpperCase()}]`);
    if (modalId === 'modal-bit-feed') {
      renderBitFeedList();
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
  }
}

function selectBookingOption(element, groupName, priceStr) {
  const parent = element.parentElement;
  parent.querySelectorAll('.option-select-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  element.classList.add('selected');
  
  let modalWrapper = element;
  while (modalWrapper && !modalWrapper.classList.contains('modal-overlay')) {
    modalWrapper = modalWrapper.parentElement;
  }
  
  if (modalWrapper) {
    const modalId = modalWrapper.id;
    activeSelectionPrices[modalId] = parseFloat(priceStr);
    activeSelectionTiers[modalId] = element.getAttribute('data-val');
    
    logActivity(`Input`, `Selected tier: ${activeSelectionTiers[modalId]} (₹${priceStr})`);
  }
}

// ----------------------------------------------------------------------------
// 6. DETAILED BOOKING MODULE SUBMISSIONS
// ----------------------------------------------------------------------------
function executeGenericBooking(type, title, details, cost, metadata = {}) {
  if (appState.wallet.balance < cost) {
    alert(`Insufficient balance in SART Wallet!\nRequired: ₹${cost.toFixed(2)}\nAvailable: ₹${appState.wallet.balance.toFixed(2)}`);
    logActivity(`Error`, `Transaction failed: Insufficient funds for booking ${title}`);
    return false;
  }

  appState.wallet.balance -= cost;
  const pointsEarned = Math.floor(cost * 0.5);
  appState.wallet.points += pointsEarned;
  
  const tx = {
    id: `tx-${Date.now()}`,
    title: `${title} Payment`,
    amount: cost,
    date: new Date().toLocaleString(),
    isCredit: false,
    category: type.toUpperCase()
  };
  appState.wallet.transactions.unshift(tx);

  const newBookingId = `bk-${Date.now()}`;
  const newBooking = {
    id: newBookingId,
    title: title,
    type: type,
    dateTime: new Date(Date.now() + 86400000).toLocaleString(),
    details: details,
    status: 'Active',
    cost: cost,
    meta: metadata
  };
  appState.bookings.unshift(newBooking);
  appState.activeBookingId = newBookingId;

  logActivity(`Wallet`, `Charged ₹${cost.toFixed(2)} for ${title}. Gained +${pointsEarned} loyalty points.`);
  logActivity(`Bookings`, `Added active booking: ${details}`);
  
  saveState();
  
  // Set Map active booking text
  document.getElementById('map-active-booking-title').innerText = title;
  document.getElementById('map-active-booking-desc').innerText = `Scheduled trip active. Coordinates loading...`;
  document.getElementById('map-active-booking-card').style.display = 'block';
  
  let mapIconClass = 'fa-car-side';
  if (type === 'sea') mapIconClass = 'fa-ship';
  else if (type === 'air') mapIconClass = 'fa-plane';
  else if (type === 'train') mapIconClass = 'fa-train';
  document.getElementById('map-active-booking-icon').className = `fa-solid ${mapIconClass}`;

  const activeModal = document.querySelector('.modal-overlay.open');
  if (activeModal) closeModal(activeModal.id);

  setTimeout(() => {
    alert(`🎉 Ticket Booked Successfully!\n\n${title}\nDetails: ${details}\nCharged: ₹${cost.toFixed(2)}\n\nYour active ride is now live-tracked on the map!`);
    switchTab('home');
    document.querySelector('.web-main-content').scrollTop = 0; // scroll map into view
    animateActiveBookingRoute(title, type);
  }, 350);

  return true;
}

// Bindings
window.selectFleetItem = function(element, tierName, price) {
  const container = element.closest('.fleet-list-container');
  if (container) {
    container.querySelectorAll('.fleet-item').forEach(el => el.classList.remove('selected'));
  }
  element.classList.add('selected');
  activeSelectionTiers['modal-ride'] = tierName;
  activeSelectionPrices['modal-ride'] = price;
}

function submitRoadRideBooking() {
  const from = document.getElementById('ride-from').value;
  const to = document.getElementById('ride-to').value;
  const date = document.getElementById('ride-date')?.value || '';
  const time = document.getElementById('ride-time')?.value || '';
  const cost = activeSelectionPrices['modal-ride'] || 800;
  const tier = activeSelectionTiers['modal-ride'] || 'Micro Hatchback';
  
  let subtitle = `${tier} • Premium Chauffeur`;
  if (date || time) {
    subtitle += ` • Scheduled: ${date} ${time}`.trim();
  }
  
  executeGenericBooking('ride', `Ride: ${from} to ${to}`, subtitle, cost, { from, to, date, time });
}

function submitCarrierBooking() {
  const from = document.getElementById('carrier-from').value;
  const to = document.getElementById('carrier-to').value;
  const cost = activeSelectionPrices['modal-carrier'];
  const tier = activeSelectionTiers['modal-carrier'];
  executeGenericBooking('carrier', `Carrier: ${from} to ${to}`, `${tier} • Logistics Cargo`, cost, { from, to });
}

function submitRentalBooking() {
  const days = document.getElementById('rental-days').value;
  const costPerDay = activeSelectionPrices['modal-rental'];
  const tier = activeSelectionTiers['modal-rental'];
  const totalCost = costPerDay * parseInt(days);
  executeGenericBooking('rental', `${tier} Rental`, `Duration: ${days} Days • Self-Drive`, totalCost, { days });
}

function submitDriverBooking() {
  const pickup = document.getElementById('driver-pickup').value;
  const cost = activeSelectionPrices['modal-drivers'];
  const tier = activeSelectionTiers['modal-drivers'];
  executeGenericBooking('drivers', `Driver Hire`, `Period: ${tier} • Pickup: ${pickup}`, cost, { pickup });
}

function submitParkingBooking() {
  const zone = document.getElementById('parking-zone').value;
  const cost = activeSelectionPrices['modal-parking'];
  const tier = activeSelectionTiers['modal-parking'];
  executeGenericBooking('parking', `Reserved Slot: ${zone}`, `${tier} • Allocated`, cost, { zone });
}

function submitMechanicBooking() {
  const issue = document.getElementById('mech-issue').value;
  const cost = activeSelectionPrices['modal-mechanic'];
  const tier = activeSelectionTiers['modal-mechanic'];
  executeGenericBooking('mechanic', `Mechanic visit`, `Diagnosis: ${tier} • Issue: ${issue.substring(0, 25)}...`, cost, { issue });
}

function submitSeaBooking() {
  const from = document.getElementById('sea-from').value;
  const to = document.getElementById('sea-to').value;
  const cost = activeSelectionPrices['modal-sea'];
  const tier = activeSelectionTiers['modal-sea'];
  executeGenericBooking('sea', `Sea Voyage: ${from} to ${to}`, `Vessel: ${tier} • Maritime Boarding`, cost, { from, to });
}

function submitAirBooking() {
  const from = document.getElementById('air-from').value;
  const to = document.getElementById('air-to').value;
  const cost = activeSelectionPrices['modal-air'];
  const tier = activeSelectionTiers['modal-air'];
  executeGenericBooking('air', `Air Transit: ${from} to ${to}`, `Flight: ${tier} • Cabin Clearance`, cost, { from, to });
}

function submitTrainBooking() {
  const from = document.getElementById('train-from').value;
  const to = document.getElementById('train-to').value;
  const cost = activeSelectionPrices['modal-train'];
  const tier = activeSelectionTiers['modal-train'];
  executeGenericBooking('train', `Train Journey: ${from} to ${to}`, `Express: ${tier} • Platform Departure`, cost, { from, to });
}

// ----------------------------------------------------------------------------
// 7. WALLET SCREEN FUNCTIONS
// ----------------------------------------------------------------------------
function toggleWalletForm(formType) {
  const dep = document.getElementById('wallet-deposit-form');
  const trsf = document.getElementById('wallet-transfer-form');
  if (formType === 'deposit') {
    dep.style.display = dep.style.display === 'none' ? 'block' : 'none';
    trsf.style.display = 'none';
  } else {
    trsf.style.display = trsf.style.display === 'none' ? 'block' : 'none';
    dep.style.display = 'none';
  }
}

function executeWalletDeposit() {
  const amount = parseFloat(document.getElementById('deposit-amount').value);
  const source = document.getElementById('deposit-source').value;
  
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid deposit amount.");
    return;
  }

  appState.wallet.balance += amount;
  const pointsEarned = Math.floor(amount * 0.5);
  appState.wallet.points += pointsEarned;

  const tx = {
    id: `tx-${Date.now()}`,
    title: `Top-up via ${source}`,
    amount: amount,
    date: new Date().toLocaleString(),
    isCredit: true,
    category: 'Deposit'
  };
  appState.wallet.transactions.unshift(tx);

  logActivity(`Wallet`, `Loaded ₹${amount.toFixed(2)} from ${source}.`);
  saveState();
  
  document.getElementById('wallet-deposit-form').style.display = 'none';
  alert(`₹${amount.toFixed(2)} Loaded Successfully!`);
}

function executeWalletTransfer() {
  const recipient = document.getElementById('transfer-recipient').value;
  const amount = parseFloat(document.getElementById('transfer-amount').value);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid transfer amount.");
    return;
  }
  if (!recipient.trim()) {
    alert("Please enter recipient account details.");
    return;
  }

  if (appState.wallet.balance < amount) {
    alert("Insufficient balance for this transfer.");
    return;
  }

  appState.wallet.balance -= amount;
  
  const tx = {
    id: `tx-${Date.now()}`,
    title: `Transfer to ${recipient}`,
    amount: amount,
    date: new Date().toLocaleString(),
    isCredit: false,
    category: 'Transfer'
  };
  appState.wallet.transactions.unshift(tx);

  logActivity(`Wallet`, `Transferred ₹${amount.toFixed(2)} to ${recipient}.`);
  saveState();
  
  document.getElementById('wallet-transfer-form').style.display = 'none';
  alert(`₹${amount.toFixed(2)} transferred successfully.`);
}







// ----------------------------------------------------------------------------
// 10. NOTIFICATIONS MODULE
// ----------------------------------------------------------------------------
function renderNotifications() {
  const container = document.getElementById('notifications-container');
  const badge = document.getElementById('notif-badge');
  if (!container) return;

  container.innerHTML = '';
  
  const unreadList = appState.notifications.filter(n => !n.read);
  if (badge) {
    if (unreadList.length > 0) {
      badge.style.display = 'flex';
      badge.innerText = unreadList.length;
    } else {
      badge.style.display = 'none';
    }
  }

  appState.notifications.forEach(n => {
    container.innerHTML += `
      <div style="background: rgba(255,255,255,0.02); border: 1px solid ${n.read ? 'var(--card-border)' : 'var(--primary)'}; border-radius: 16px; padding: 12px; position: relative; cursor: pointer;" onclick="markNotificationRead('${n.id}')">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <h4 style="font-size: 12.5px; font-weight: bold; display: flex; align-items: center; gap: 6px;">
            ${!n.read ? '<span style="width: 6px; height: 6px; background: var(--primary); border-radius: 50%;"></span>' : ''}
            ${n.title}
          </h4>
          <span style="font-size: 9.5px; color: var(--text-secondary);">${n.date}</span>
        </div>
        <p style="font-size: 11.5px; color: var(--text-secondary); line-height: 1.4;">${n.desc}</p>
      </div>
    `;
  });
}

function markNotificationRead(notifId) {
  const n = appState.notifications.find(item => item.id === notifId);
  if (n && !n.read) {
    n.read = true;
    saveState();
  }
}

// ----------------------------------------------------------------------------
// 11. PORTAL SMART SEARCH
// ----------------------------------------------------------------------------
function executePortalSearch() {
  const query = document.getElementById('portal-search-input').value.toLowerCase();
  const resultsContainer = document.getElementById('portal-search-results');
  if (!resultsContainer) return;

  resultsContainer.innerHTML = '';
  if (!query.trim()) {
    resultsContainer.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 10px; font-size:12px;">Type keywords above to search SART database...</div>`;
    return;
  }

  const searchOptions = [
    { title: 'Road Ride Booking', kw: ['ride', 'taxi', 'car', 'cab', 'economy', 'suv'], modal: 'modal-ride', icon: 'fa-car', color: 'var(--primary)' },
    { title: 'Logistics Cargo Truck', kw: ['carrier', 'truck', 'logistics', 'delivery', 'cargo'], modal: 'modal-carrier', icon: 'fa-truck', color: 'var(--secondary)' },
    { title: 'Hourly Vehicle Rental', kw: ['rental', 'key', 'nexon', 'himalayan', 'bike', 'motorcycle'], modal: 'modal-rental', icon: 'fa-key', color: 'var(--accent)' },
    { title: 'Personal Chauffeur Hire', kw: ['driver', 'chauffeur', 'verified'], modal: 'modal-drivers', icon: 'fa-user-tie', color: 'var(--warning)' },
    { title: 'Shared Parking Spot', kw: ['parking', 'slot', 'ev slot'], modal: 'modal-parking', icon: 'fa-square-p', color: '#8b5cf6' },
    { title: 'Mechanic Diagnostic Visit', kw: ['mechanic', 'repair', 'wheel', 'overhaul'], modal: 'modal-mechanic', icon: 'fa-screwdriver-wrench', color: '#64748b' },
    { title: 'Ferry & Yacht Sea Booking', kw: ['sea', 'ferry', 'yacht', 'maritime', 'boat', 'water'], modal: 'modal-sea', icon: 'fa-ship', color: 'var(--success)' },
    { title: 'Flight & Heli Air Booking', kw: ['air', 'flight', 'helicopter', 'chopper', 'plane', 'sky'], modal: 'modal-air', icon: 'fa-plane', color: 'var(--warning)' },
    { title: 'Train Vande Bharat Book', kw: ['train', 'express', 'metro', 'railway', 'vande', 'rajdhani'], modal: 'modal-train', icon: 'fa-train', color: '#c864ff' }
  ];

  const matched = searchOptions.filter(opt => {
    return opt.title.toLowerCase().includes(query) || opt.kw.some(k => k.includes(query));
  });

  if (matched.length === 0) {
    resultsContainer.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 15px; font-size:12px;">No matching modules found in directory.</div>`;
    return;
  }

  matched.forEach(opt => {
    resultsContainer.innerHTML += `
      <div class="booking-card" onclick="closeModal('modal-search'); openModal('${opt.modal}')">
        <div class="booking-card-left">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; color: ${opt.color};">
            <i class="fa-solid ${opt.icon}"></i>
          </div>
          <div class="booking-card-text">
            <h4>${opt.title}</h4>
            <p style="font-size: 9px; text-transform: uppercase;">Shortcut trigger</p>
          </div>
        </div>
        <i class="fa-solid fa-chevron-right" style="font-size: 10px; color: var(--text-secondary);"></i>
      </div>
    `;
  });
}

// ----------------------------------------------------------------------------
// 12. BIT LIVE BOOKING ACTIVITY TRACKER
// ----------------------------------------------------------------------------
let bitAlertsEnabled = true;
let bitActivitiesList = [
  { name: "Rohan", city: "Chennai", item: "Root Canal Treatment", loc: "Apollo Dental Care", time: "2 mins ago", category: "lifestyle", emoji: "🦷" },
  { name: "Amit", city: "Bengaluru", item: "Airport Sedan Ride", loc: "Kempegowda Airport", time: "10 mins ago", category: "ride", emoji: "🚗" },
  { name: "Rajesh Kumar", city: "Indiranagar", item: "Tire Diagnostics", loc: "SART Service Node", time: "12 mins ago", category: "mechanic", emoji: "🔧" }
];

function toggleBitToasts(enabled) {
  bitAlertsEnabled = enabled;
  logActivity(`BIT`, `Real-time toast alerts ${enabled ? 'enabled' : 'disabled'}`);
  const toggleCheckbox = document.getElementById('bit-alert-toggle');
  if (toggleCheckbox) {
    toggleCheckbox.checked = enabled;
  }
}

function simulateNewLiveActivity() {
  const act = MOCK_ACTIVITIES[Math.floor(Math.random() * MOCK_ACTIVITIES.length)];
  const newAct = { ...act, time: "Just now" };
  
  bitActivitiesList.unshift(newAct);
  if (bitActivitiesList.length > 15) bitActivitiesList.pop();
  
  renderBitFeedList();
  showRandomLiveActivity(newAct);
  logActivity(`BIT`, `Simulated booking: ${newAct.name} - ${newAct.item}`);
}

function handleBitFeedItemClick(category) {
  closeModal('modal-bit-feed');
  
  const categoryModals = {
    ride: 'modal-ride',
    mechanic: 'modal-mechanic',
    sea: 'modal-sea',
    air: 'modal-air',
    train: 'modal-train',
    rental: 'modal-rental',
    parking: 'modal-parking'
  };
  
  const targetModal = categoryModals[category];
  if (targetModal) {
    openModal(targetModal);
    logActivity(`BIT`, `Interactive navigation to booking modal: ${targetModal}`);
  } else {
    if (category === 'lifestyle') {
      alert("🩺 Lifestyle services: Apollo Dental Care online booking portal loading...");
    } else {
      switchTab('home');
    }
  }
}

function renderBitFeedList() {
  const container = document.getElementById('bit-feed-list');
  if (!container) return;
  
  container.innerHTML = '';
  bitActivitiesList.forEach(act => {
    container.innerHTML += `
      <div style="display:flex; justify-content:space-between; align-items:center; border: 1px solid var(--dark-border); padding: 10px 12px; border-radius: 12px; background: rgba(0,0,0,0.15); font-size:12px; animation: fadeIn 0.3s ease; cursor: pointer; transition: all 0.2s ease;" 
           onmouseover="this.style.background='rgba(21, 127, 138, 0.12)'; this.style.borderColor='var(--primary)';" 
           onmouseout="this.style.background='rgba(0,0,0,0.15)'; this.style.borderColor='var(--dark-border)';"
           onclick="handleBitFeedItemClick('${act.category}')">
        <div style="display:flex; gap:10px; align-items:center;">
          <div style="width:34px; height:34px; border-radius:50%; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; font-size:16px; border: 1px solid rgba(255,255,255,0.08);">
            ${act.emoji}
          </div>
          <div>
            <div style="color: #fff;"><strong style="font-weight: 700; color: #fff;">${act.name}</strong> in ${act.city} booked <u style="text-decoration: underline; font-weight: 700; color: #fff;">${act.item}</u></div>
            <div style="font-size:10px; color:var(--text-secondary); margin-top:2px;">at ${act.loc}</div>
          </div>
        </div>
        <span style="font-size:10px; color:var(--text-secondary); white-space:nowrap; margin-left:10px;">${act.time}</span>
      </div>
    `;
  });
}

// ----------------------------------------------------------------------------
// 13. DYNAMIC PROFILE SUB-PAGES
// ----------------------------------------------------------------------------
function openProfileSubpage(featureId, title) {
  document.getElementById('subpage-title-txt').innerText = title;
  const container = document.getElementById('subpage-content-container');
  container.innerHTML = '';

  let htmlContent = '';
  
  if (featureId === 'documents') {
    htmlContent = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <h4 style="color: var(--primary);"><i class="fa-solid fa-id-card"></i> Digilocker Integration</h4>
        <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.4;">Verify your identity files to unlock high-speed premium vehicle rentals.</p>
        
        <div style="display:flex; justify-content:space-between; align-items:center; border: 1px solid var(--dark-border); padding: 12px; border-radius: 12px; background: rgba(0,0,0,0.2);">
          <div>
            <div style="font-size:12.5px; font-weight:bold;">Driving License</div>
            <div style="font-size:10px; color:var(--success);">Verified (Valid till 2038)</div>
          </div>
          <i class="fa-solid fa-circle-check" style="color:var(--success);"></i>
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; border: 1px solid var(--dark-border); padding: 12px; border-radius: 12px; background: rgba(0,0,0,0.2);">
          <div>
            <div style="font-size:12.5px; font-weight:bold;">Vehicle RC Permit</div>
            <div style="font-size:10px; color:var(--success);">KA-03-MY-8820 Verified</div>
          </div>
          <i class="fa-solid fa-circle-check" style="color:var(--success);"></i>
        </div>
        
        <button class="action-btn" style="padding: 10px; font-size:12px; align-self: flex-start;" onclick="alert('Upload system offline in demo mode.')">Upload New Documents</button>
      </div>
    `;
  } else if (featureId === 'payment') {
    htmlContent = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <h4><i class="fa-solid fa-credit-card"></i> Linked Payment Cards</h4>
        
        <div style="display:flex; gap:12px; align-items:center; border: 1px solid var(--dark-border); padding: 12px; border-radius: 12px;">
          <i class="fa-brands fa-cc-visa" style="font-size:24px; color:#1a1f71;"></i>
          <div>
            <div style="font-size:12.5px; font-weight:bold;">Visa Personal Classic</div>
            <div style="font-size:10px; color:var(--text-secondary);">•••• •••• •••• 4242 | Expiry 12/28</div>
          </div>
        </div>

        <div style="display:flex; gap:12px; align-items:center; border: 1px solid var(--dark-border); padding: 12px; border-radius: 12px;">
          <i class="fa-brands fa-cc-mastercard" style="font-size:24px; color:#eb001b;"></i>
          <div>
            <div style="font-size:12.5px; font-weight:bold;">Mastercard Gold Business</div>
            <div style="font-size:10px; color:var(--text-secondary);">•••• •••• •••• 8839 | Expiry 09/27</div>
          </div>
        </div>

        <button class="action-btn" style="padding: 10px; font-size:12px; align-self: flex-start;" onclick="alert('Adding cards restricted in front-end demo.')">Link UPI / Debit Card</button>
      </div>
    `;
  } else if (featureId === 'safety') {
    htmlContent = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <h4><i class="fa-solid fa-shield-halved"></i> Safety & Ride Settings</h4>
        <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.4;">Configure custom safety flags and driver matching rules for your commutes.</p>
        
        <div style="display:flex; justify-content:space-between; align-items:center; border: 1px solid var(--dark-border); padding: 12px; border-radius: 12px; background: rgba(0,0,0,0.2);">
          <div>
            <div style="font-size:12.5px; font-weight:bold;">Kids & Women Safe Mode</div>
            <div style="font-size:10px; color:var(--text-secondary);">Only matches with 5-star verified drivers with safety shield partition.</div>
          </div>
          <label class="switch-container" style="position:relative; display:inline-block; width:40px; height:20px; cursor:pointer;">
            <input type="checkbox" checked style="opacity:0; width:0; height:0;">
            <span style="position:absolute; top:0; left:0; right:0; bottom:0; background-color:#157f8a; transition:0.3s; border-radius:34px;"></span>
          </label>
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; border: 1px solid var(--dark-border); padding: 12px; border-radius: 12px; background: rgba(0,0,0,0.2);">
          <div>
            <div style="font-size:12.5px; font-weight:bold;">Professional Driver Mode</div>
            <div style="font-size:10px; color:var(--text-secondary);">Matches only executive sedan classes. Silent ride environment.</div>
          </div>
          <label class="switch-container" style="position:relative; display:inline-block; width:40px; height:20px; cursor:pointer;">
            <input type="checkbox" style="opacity:0; width:0; height:0;">
            <span style="position:absolute; top:0; left:0; right:0; bottom:0; background-color:#8b949e; transition:0.3s; border-radius:34px;"></span>
          </label>
        </div>
        
        <button class="action-btn" style="padding: 10px; font-size:12px; align-self: flex-start;" onclick="backToProfile()">Save Preferences</button>
      </div>
    `;
  } else {
    htmlContent = `
      <div>
        <h4>${title} Configurations</h4>
        <p style="font-size:12px; color:var(--text-secondary); margin-top: 10px; line-height: 1.5;">
          This subpage controls parameters related to ${title.toLowerCase()}. Settings saved to session storage.
        </p>
        <div class="form-group" style="margin-top: 16px;">
          <label>Toggle Active status</label>
          <select class="input-field select-field" style="width: 200px;">
            <option value="1">Enabled / On</option>
            <option value="0">Disabled / Off</option>
          </select>
        </div>
        <button class="action-btn" style="padding: 10px; font-size:12px; margin-top: 14px;" onclick="backToProfile()">Save Settings</button>
      </div>
    `;
  }

  container.innerHTML = htmlContent;
  
  document.querySelectorAll('.tab-screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById('tab-profile-subpage').classList.add('active');
}

function backToProfile() {
  switchTab('profile');
}

// ----------------------------------------------------------------------------
// 13. DEVELOPER LOGGER & UI SYNC
// ----------------------------------------------------------------------------
function logActivity(module, message) {
  console.log(`[${module}] ${message}`);
}

function updateUI() {
  const balText = `₹${appState.wallet.balance.toFixed(2)}`;
  const ptsText = `${appState.wallet.points} pts`;
  const cbText = `₹${appState.wallet.cashback.toFixed(2)}`;

  // Update navbar elements
  if (document.getElementById('nav-wallet-balance')) document.getElementById('nav-wallet-balance').innerText = balText;
  if (document.getElementById('nav-wallet-points')) document.getElementById('nav-wallet-points').innerText = ptsText;

  // Update sidebar widgets
  if (document.getElementById('side-wallet-balance')) document.getElementById('side-wallet-balance').innerText = balText;
  if (document.getElementById('side-wallet-points')) document.getElementById('side-wallet-points').innerText = ptsText;
  if (document.getElementById('side-wallet-cashback')) document.getElementById('side-wallet-cashback').innerText = cbText;

  // Update modal elements
  if (document.getElementById('wallet-balance-txt')) document.getElementById('wallet-balance-txt').innerText = balText;
  if (document.getElementById('wallet-points-txt')) document.getElementById('wallet-points-txt').innerText = ptsText;
  if (document.getElementById('wallet-cashback-txt')) document.getElementById('wallet-cashback-txt').innerText = cbText;

  // Sync Cart badge
  const cartCount = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.getElementById('cart-badge');
  if (cartBadge) cartBadge.innerText = cartCount;

  // Update transactions list
  const txList = document.getElementById('wallet-transactions-list');
  if (txList) {
    txList.innerHTML = '';
    appState.wallet.transactions.slice(0, 5).forEach(tx => {
      txList.innerHTML += `
        <div style="display:flex; justify-content:space-between; align-items:center; border: 1px solid var(--dark-border); padding: 8px 12px; border-radius: 10px; background: rgba(0,0,0,0.1); font-size:11.5px;">
          <div>
            <div style="font-weight:bold;">${tx.title}</div>
            <div style="font-size:9px; color:var(--text-secondary); margin-top:2px;">${tx.date}</div>
          </div>
          <span style="font-weight:850; color: ${tx.isCredit ? 'var(--success)' : 'var(--error)'};">
            ${tx.isCredit ? '+' : '-'}₹{(Number(tx.amount) || 0).toFixed(0)}
          </span>
        </div>
      `;
    });
  }

  // Refresh widgets
  if (typeof renderNotifications === 'function') renderNotifications();
}

// Toast helper
function showToastNotification(message) {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '30px';
  container.style.left = '50%';
  container.style.transform = 'translateX(-50%)';
  container.style.background = 'rgba(0, 0, 0, 0.85)';
  container.style.color = '#fff';
  container.style.padding = '10px 20px';
  container.style.borderRadius = '20px';
  container.style.fontSize = '12.5px';
  container.style.fontWeight = 'bold';
  container.style.zIndex = '1002';
  container.style.boxShadow = 'var(--shadow-premium)';
  container.style.animation = 'slideUp 0.3s ease';
  container.innerText = message;

  document.body.appendChild(container);
  
  setTimeout(() => {
    container.remove();
  }, 2200);
}

// Location lookup trigger
function requestLocation() {
  const txt = document.getElementById('current-location-txt');
  const navTxt = document.getElementById('nav-location-txt');
  
  if (txt) txt.innerText = "Locating GPS...";
  if (navTxt) navTxt.innerText = "Locating...";
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (txt) txt.innerText = "Chennai";
        if (navTxt) navTxt.innerText = "Chennai";
        logActivity(`System`, `Location updated: [Chennai]`);
        if (leafletMap && userMarker) {
          userMarker.setLatLng(BENGALURU_COORDS); 
          recenterMap();
        }
      },
      (err) => {
        if (txt) txt.innerText = "Chennai";
        if (navTxt) navTxt.innerText = "Chennai";
      }
    );
  } else {
    if (txt) txt.innerText = "Chennai";
    if (navTxt) navTxt.innerText = "Chennai";
  }
}

// ----------------------------------------------------------------------------
// 14. WIREFRAME INTEGRATION & HELPER FUNCTIONS
// ----------------------------------------------------------------------------

function triggerNearbyFind() {
  if (leafletMap) {
    leafletMap.setView(BENGALURU_COORDS, 14, { animate: true });
    
    // Add flashing border style to map container as scan feedback
    const mapPanel = document.querySelector('.home-map-panel');
    if (mapPanel) {
      mapPanel.style.borderColor = 'var(--secondary)';
      mapPanel.style.boxShadow = '0 0 30px rgba(212, 167, 41, 0.4)';
      setTimeout(() => {
        mapPanel.style.borderColor = 'var(--card-border)';
        mapPanel.style.boxShadow = 'var(--shadow-premium)';
      }, 1500);
    }
    
    generateNearbyHotspots();
    logActivity('Map', 'Triggered NEAR BY FIND hotspot scanning pulse');
    showToastNotification('Nearby vehicles scanner active!');
  }
}

function triggerLikedRoute(fromLabel, toLabel) {
  closeModal('modal-liked');
  
  // Pre-populate ride booking inputs
  const rideFrom = document.getElementById('ride-from');
  const rideTo = document.getElementById('ride-to');
  
  if (fromLabel === 'Home' && toLabel === 'Office') {
    if (rideFrom) rideFrom.value = 'Indiranagar Home';
    if (rideTo) rideTo.value = 'Whitefield IT Park';
  } else if (fromLabel === 'Office' && toLabel === 'Airport') {
    if (rideFrom) rideFrom.value = 'Whitefield Office';
    if (rideTo) rideTo.value = 'Kempegowda Int\'l Airport';
  } else if (fromLabel === 'Home' && toLabel === 'Weekend Villa') {
    // Open maritime booking directly
    const seaFrom = document.getElementById('sea-from');
    const seaTo = document.getElementById('sea-to');
    if (seaFrom) seaFrom.value = 'Gateway of India, Mumbai';
    if (seaTo) seaTo.value = 'Mandwa Jetty, Alibaug';
    openModal('modal-sea');
    return;
  }
  
  openModal('modal-ride');
}

function loadScenicRouteNH66() {
  closeModal('modal-travel-guide');
  switchTab('home');
  document.querySelector('.web-main-content').scrollTop = 0;
  animateActiveBookingRoute('Coastal Cruise NH-66', 'sea');
  showToastNotification('Plotting Scenic NH-66 Route...');
}

function executeFindMyVehicle() {
  closeModal('modal-find-vehicle');
  switchTab('home');
  document.querySelector('.web-main-content').scrollTop = 0;
  
  if (leafletMap) {
    const vehicleCoords = [BENGALURU_COORDS[0] - 0.004, BENGALURU_COORDS[1] + 0.005];
    leafletMap.setView(vehicleCoords, 16, { animate: true });
    
    // Add locator pin
    const locatorIcon = L.divIcon({
      className: 'vehicle-locator-gps',
      html: `<div style="width: 36px; height: 36px; background: rgba(21, 127, 138, 0.2); border: 2.5px solid var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px var(--primary); animation: pulseRed 1s infinite alternate;">
              <i class="fa-solid fa-car" style="color: #fff; font-size: 14px;"></i>
             </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
    
    const tempVehicleMarker = L.marker(vehicleCoords, { icon: locatorIcon }).addTo(leafletMap);
    tempVehicleMarker.bindPopup("<strong>Tata Nexon EV</strong><br>KA-03-MY-8820<br>Status: Securely Parked").openPopup();
    
    setTimeout(() => {
      leafletMap.removeLayer(tempVehicleMarker);
    }, 7000);
    
    logActivity('Telemetry', 'Located Nexon EV KA-03-MY-8820 on Home map');
    showToastNotification('Vehicle located at Indiranagar Stage 2');
  }
}

function scrollToNewsSection() {
  const el = document.getElementById('news-section-div');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    showToastNotification('Navigating to Ecosystem News');
  }
}

function sendAiMessage() {
  const input = document.getElementById('ai-chat-input');
  const chatHistory = document.getElementById('ai-chat-history');
  if (!input || !chatHistory || !input.value.trim()) return;
  
  const userText = input.value.trim();
  
  // Append user message
  chatHistory.innerHTML += `
    <div class="chat-msg user">
      <p>${userText}</p>
    </div>
  `;
  
  input.value = '';
  chatHistory.scrollTop = chatHistory.scrollHeight;
  
  logActivity('AI', `User query: "${userText}"`);
  
  // Simulate assistant typing/reply
  setTimeout(() => {
    let replyText = "I have scanned the SART transit databases. Traffic flow is stable. Let me know if you need any tickets or dispatch scheduling!";
    const lower = userText.toLowerCase();
    
    if (lower.includes('battery') || lower.includes('nexon') || lower.includes('charge')) {
      replyText = "Nexon EV battery telemetry reads 84% charge. Projected range is 310 km. Cell health is optimal at 98.2%. Temperature is 31°C.";
    } else if (lower.includes('tire') || lower.includes('pressure') || lower.includes('psi')) {
      replyText = "Diagnostics alert: Front-left tire pressure reads 28 PSI (slightly low). Recommended is 33 PSI. You can purchase a portable inflator upgrade in the Store!";
    } else if (lower.includes('route') || lower.includes('commute') || lower.includes('traffic')) {
      replyText = "Ecosystem routes check: Coastal Highway NH-66 has excellent speeds. Indiranagar outer ring road reports light delays near tech depots.";
    } else if (lower.includes('parking') || lower.includes('slot')) {
      replyText = "Checking smart parking grids... Indiranagar tech zone reports 2 empty slots, including 1 EV slot with fast-charging units. You can reserve directly from Home.";
    } else if (lower.includes('hello') || lower.includes('hi')) {
      replyText = "Hello! I am your AI Copilot. I can assist with Nexon EV telemetry, real-time traffic updates, or booking options. What can I check for you?";
    }
    
    chatHistory.innerHTML += `
      <div class="chat-msg assistant">
        <p>${replyText}</p>
      </div>
    `;
    chatHistory.scrollTop = chatHistory.scrollHeight;
    logActivity('AI', `AI response: "${replyText}"`);
  }, 1000);
}



// ----------------------------------------------------------------------------
// 15. INITIAL BOOTSTRAP RUNNER
// ----------------------------------------------------------------------------
function bootstrapLegacyApp() {
  loadState();

  // Load News list on Home Screen
  const newsRow = document.getElementById('news-cards-container');
  if (newsRow) {
    newsRow.innerHTML = '';
    AUTO_NEWS.forEach(n => {
      newsRow.innerHTML += `
        <div class="news-card" onclick="alert('${n.title}\\n\\nSource: ${n.source}\\n\\n${n.desc}')">
          <img class="news-card-img" src="${n.img}" alt="${n.tag}" />
          <div class="news-card-content">
            <div class="news-card-header">
              <span class="news-card-tag">${n.tag}</span>
              <span class="news-card-date">${n.date}</span>
            </div>
            <div class="news-card-title">${n.title}</div>
            <div class="news-card-footer">
              <span>${n.source}</span>
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </div>
      `;
    });
  }


  // Sync state variables
  updateUI();

  // Init leaflet maps
  initMap();
  
  // Start automated banner carousel & theme init
  startCarouselAutoPlay();
  initAppTheme();

  // Check if an active booking was left in state, show overlay
  const activeB = appState.bookings.find(b => b.status === 'Active');
  if (activeB) {
    appState.activeBookingId = activeB.id;
    document.getElementById('map-active-booking-title').innerText = activeB.title;
    document.getElementById('map-active-booking-desc').innerText = `Active trip tracking...`;
    document.getElementById('map-active-booking-card').style.display = 'block';
    
    let mapIconClass = 'fa-car-side';
    if (activeB.type === 'sea') mapIconClass = 'fa-ship';
    else if (activeB.type === 'air') mapIconClass = 'fa-plane';
    else if (activeB.type === 'train') mapIconClass = 'fa-train';
    document.getElementById('map-active-booking-icon').className = `fa-solid ${mapIconClass}`;
    
    setTimeout(() => {
      animateActiveBookingRoute(activeB.title, activeB.type);
    }, 1000);
  }
}



// ============================================================================
// 16. BOKSPOT OVERLAYS & LIVE REDESIGN UTILITIES
// ============================================================================
let currentSlideIndex = 0;
let carouselTimer = null;

function setSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  if (slides.length === 0) return;
  
  // Bound check
  if (index >= slides.length) index = 0;
  if (index < 0) index = slides.length - 1;
  
  currentSlideIndex = index;
  
  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === index);
  });
  
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === index);
  });
}

function startCarouselAutoPlay() {
  stopCarouselAutoPlay();
  carouselTimer = setInterval(() => {
    setSlide(currentSlideIndex + 1);
  }, 5000);
}

function stopCarouselAutoPlay() {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }
}

// Floating AI chatbot triggers and toast notifications are removed to streamline the Bokspot UI.

// ============================================================================
// 16. BOKSPOT ACCOUNT DROPDOWN & THEME SYSTEM
// ============================================================================

function toggleProfileDropdown(event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById('profile-dropdown-menu');
  if (menu) {
    menu.classList.toggle('show');
  }
}

function closeProfileDropdown() {
  const menu = document.getElementById('profile-dropdown-menu');
  if (menu) {
    menu.classList.remove('show');
  }
}

// Global window click listener to dismiss profile dropdown when clicking outside
window.addEventListener('click', function(e) {
  const menu = document.getElementById('profile-dropdown-menu');
  const trigger = document.querySelector('.profile-nav-btn');
  if (menu && menu.classList.contains('show')) {
    if (!menu.contains(e.target) && (!trigger || !trigger.contains(e.target))) {
      closeProfileDropdown();
    }
  }
});

function setAppTheme(theme) {
  const body = document.body;
  const lightBtn = document.getElementById('theme-btn-light');
  const darkBtn = document.getElementById('theme-btn-dark');
  const systemBtn = document.getElementById('theme-btn-system');
  
  if (lightBtn) lightBtn.classList.remove('active');
  if (darkBtn) darkBtn.classList.remove('active');
  if (systemBtn) systemBtn.classList.remove('active');
  
  const targetBtn = document.getElementById(`theme-btn-${theme}`);
  if (targetBtn) targetBtn.classList.add('active');
  
  if (theme === 'light') {
    body.classList.add('light-theme');
    localStorage.setItem('sart-theme', 'light');
  } else if (theme === 'dark') {
    body.classList.remove('light-theme');
    localStorage.setItem('sart-theme', 'dark');
  } else if (theme === 'system') {
    localStorage.setItem('sart-theme', 'system');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
    }
  }
}

function initAppTheme() {
  const savedTheme = localStorage.getItem('sart-theme') || 'light';
  setAppTheme(savedTheme);
  
  // Listen for system theme changes if set to system
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (localStorage.getItem('sart-theme') === 'system') {
      if (e.matches) {
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
      }
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapLegacyApp);
} else {
  bootstrapLegacyApp();
}
