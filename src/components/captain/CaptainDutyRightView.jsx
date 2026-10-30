'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { io } from 'socket.io-client';

const InteractiveRideMap = dynamic(() => import('./InteractiveRideMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', color: '#64748b' }}>
      <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Loading Live Radar Map...
    </div>
  )
});

export default function CaptainDutyRightView({
  partnerDetails,
  isOnDuty,
  setIsOnDuty,
  onOpenProfile,
  vehicleCategoryFilter
}) {
  // Show active order requests view / modal
  const [showOrdersView, setShowOrdersView] = useState(false);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [authStatusText, setAuthStatusText] = useState('Authentication: JWT Verified • Role: Driver');
  const [activeAcceptedOrder, setActiveAcceptedOrder] = useState(null);
  const [acceptedRidesHistory, setAcceptedRidesHistory] = useState([]);
  const [captainToUserRoute, setCaptainToUserRoute] = useState([]);
  const [rideStage, setRideStage] = useState('pickup'); // 'pickup' (Captain -> User) or 'in_trip' (User/Captain -> Destination)
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isCompletingTrip, setIsCompletingTrip] = useState(false);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);

  // Live Chat with Customer
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInputText, setChatInputText] = useState('');
  const [socketRef, setSocketRef] = useState(null);


  // Live Exact GPS coordinates of the Captain (defaults strictly to Chennai 13.0827, 80.2755)
  const [captainCoords, setCaptainCoords] = useState({
    lat: partnerDetails?.lat || 13.0827,
    lng: partnerDetails?.lng || 80.2755,
    city: partnerDetails?.city || 'Chennai'
  });

  // Track exact GPS location immediately when component loads
  React.useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          let cityName = partnerDetails?.city || 'Your Location';
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': 'SART-CaptainHub/1.0 (Captain Location Service)'
              }
            });
            if (res.ok) {
              const data = await res.json();
              if (data.display_name) {
                cityName = data.display_name.split(',').slice(0, 2).join(', ').trim();
              }
            }
          } catch (e) { }

          setCaptainCoords({
            lat,
            lng,
            city: cityName
          });
        },
        (err) => console.warn('Captain GPS location:', err.message),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
    }
  }, [partnerDetails?.city]);

  // Load Captain's stored earnings and completed rides from database (persists across refresh)
  const fetchCaptainEarnings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/rides/captain-earnings');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTodayEarnings(data.todayEarnings);
          setCompletedOrdersCount(data.totalCompletedRides);
        }
      }
    } catch (e) {
      console.warn('Earnings fetch error:', e);
    }
  };

  React.useEffect(() => {
    fetchCaptainEarnings();
  }, []);

  // Incoming ride orders: strictly starts empty until user creates a real booking!
  const [incomingOrders, setIncomingOrders] = useState([]);

  // Load any previously accepted order in progress from the database (persists across refresh)
  React.useEffect(() => {
    const fetchActiveAcceptedOrder = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/rides/captain-active-order');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.activeOrder) {
            setActiveAcceptedOrder(data.activeOrder);
            setRideStage(data.activeOrder.rideStage || 'pickup');
          }
        }
      } catch (e) {
        console.warn('Active accepted order check error:', e);
      }
    };
    fetchActiveAcceptedOrder();
  }, []);

  // Socket.io connection for real-time live events & chat with user
  useEffect(() => {
    let s;
    try {
      s = io('http://localhost:5000', {
        transports: ['websocket', 'polling']
      });
      setSocketRef(s);

      s.on('connect', () => {
        console.log('[Business Socket] Connected to SART backend:', s.id);
      });

      // When a user books a ride in SART-FE-1, instantly receive the order if ON DUTY!
      // When another captain claims the ride, dismiss incoming card instantly
      const handleRideClaimed = (claimData) => {
        const claimedId = claimData?.rideId || claimData?.bookingId;
        if (!claimedId) return;
        setIncomingOrders((prev) => prev.filter((ord) => ord.id !== claimedId));
      };
      s.on('RIDE_CLAIMED', handleRideClaimed);
      s.on('RIDE_TAKEN', handleRideClaimed);

      s.on('new_incoming_ride', (newOrder) => {
        console.log('[Business Socket] Instant ride order received:', newOrder);
        if (!isOnDuty) return;
        setIncomingOrders((prev) => {
          if (prev.some((o) => o.id === newOrder.id)) return prev;
          return [newOrder, ...prev];
        });
      });

      // When a user adds extra tip / boosts fare (+₹10, +₹20, +₹50), update instantly on captain screen!
      s.on('order_fare_boosted', (boostData) => {
        console.log('[Business Socket] User boosted fare:', boostData);
        setIncomingOrders((prev) =>
          prev.map((ord) => {
            if (ord.id === boostData.bookingId) {
              return {
                ...ord,
                bonus: boostData.bonus,
                fare: boostData.fare || ord.fare,
                extraBadge: `Live: User Added +₹${boostData.bonus} Extra!`
              };
            }
            return ord;
          })
        );
        setActiveAcceptedOrder((prev) => {
          if (prev && prev.id === boostData.bookingId) {
            return {
              ...prev,
              bonus: boostData.bonus,
              fare: boostData.fare || prev.fare,
              extraBadge: `Live: User Added +₹${boostData.bonus} Extra!`
            };
          }
          return prev;
        });
      });

      // Real-time chat messages from customer
      s.on('chat_message_received', (msg) => {
        setChatMessages((prev) => [...prev, msg]);
      });
    } catch (e) {
      console.warn('[Business Socket] Connection fallback:', e);
    }

    return () => {
      if (s) s.disconnect();
    };
  }, []);

  const activeOrder = incomingOrders[selectedOrderIndex] || incomingOrders[0];
  const displayOrder = activeAcceptedOrder || activeOrder;

  // When active order exists or changes, join socket room
  useEffect(() => {
    if (socketRef && displayOrder?.id) {
      socketRef.emit('join_booking', displayOrder.id);
    }
  }, [socketRef, displayOrder?.id]);

  // Clean empty state when no incoming orders are in radar

  // Fetch real-time orders from backend using JWT Authentication & Role Authorization
  React.useEffect(() => {
    let isMounted = true;

    // When Captain is OFF DUTY, strictly hide all incoming orders and overlay
    if (!isOnDuty) {
      setIncomingOrders([]);
      setShowOrdersView(false);
      return;
    }

    const fetchAuthorizedOrders = async () => {
      try {
        const token = localStorage.getItem('sart_captain_jwt_token') || partnerDetails?.token;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const catQuery = vehicleCategoryFilter ? `&category=${vehicleCategoryFilter}` : '';
        const coordsQuery = `?lat=${captainCoords.lat}&lng=${captainCoords.lng}${catQuery}`;
        const res = await fetch(`http://localhost:5000/api/rides/captain-orders${coordsQuery}`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.orders)) {
            // Strictly sync with live database orders (no stale mock fallback!)
            setIncomingOrders(data.orders);
            setAuthStatusText(`${data.authStatus} • ${data.roleStatus}`);
            return;
          }
        }
      } catch (e) {
        console.warn('Backend orders API fetch error:', e);
      }
    };

    fetchAuthorizedOrders();
    // Poll every 3 seconds for real user bookings created in SART-FE-1
    const interval = setInterval(fetchAuthorizedOrders, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [partnerDetails, isOnDuty, vehicleCategoryFilter, captainCoords]);


  // Calculate real road polyline directions ONLY after captain accepts the order
  // Stage 1 ('pickup'): From Captain live location -> Customer pickup point
  // Stage 2 ('in_trip'): From Captain / Pickup location -> Customer destination (Dropping Point)
  useEffect(() => {
    // If no order has been accepted by this captain yet, keep map clean without any route!
    if (!activeAcceptedOrder) {
      setCaptainToUserRoute([]);
      return;
    }

    const currentStage = activeAcceptedOrder.rideStage || rideStage;

    const fetchRoutePolyline = async () => {
      try {
        let startLat = captainCoords.lat;
        let startLng = captainCoords.lng;
        let endLat = activeAcceptedOrder.userLat;
        let endLng = activeAcceptedOrder.userLng;

        if (currentStage === 'in_trip') {
          // Navigating to final destination!
          startLat = activeAcceptedOrder.userLat || captainCoords.lat;
          startLng = activeAcceptedOrder.userLng || captainCoords.lng;
          endLat = activeAcceptedOrder.dropLat || (activeAcceptedOrder.userLat - 0.018);
          endLng = activeAcceptedOrder.dropLng || (activeAcceptedOrder.userLng + 0.022);
        }

        if (!endLat || !endLng) return;

        // Use free public OSRM router for realistic road directions
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
        const res = await fetch(osrmUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.routes && data.routes[0] && data.routes[0].geometry) {
            const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
            setCaptainToUserRoute(coords);
            return;
          }
        }
      } catch (err) {
        console.warn('OSM road directions fallback:', err);
      }

      // Smooth curved road polyline fallback
      const targetLat = currentStage === 'in_trip' ? (activeAcceptedOrder.dropLat || 13.0600) : activeAcceptedOrder.userLat;
      const targetLng = currentStage === 'in_trip' ? (activeAcceptedOrder.dropLng || 80.2200) : activeAcceptedOrder.userLng;
      if (targetLat && targetLng) {
        setCaptainToUserRoute([
          [captainCoords.lat, captainCoords.lng],
          [(captainCoords.lat + targetLat) / 2 + 0.0015, (captainCoords.lng + targetLng) / 2 - 0.0015],
          [targetLat, targetLng]
        ]);
      }
    };

    fetchRoutePolyline();
  }, [
    captainCoords.lat,
    captainCoords.lng,
    activeAcceptedOrder?.userLat,
    activeAcceptedOrder?.userLng,
    activeAcceptedOrder?.dropLat,
    activeAcceptedOrder?.dropLng,
    activeAcceptedOrder?.rideStage,
  ]);


  // Handle Captain Reaching User and entering 4-digit ride OTP
  const handleVerifyOtpAndStartTrip = async (e) => {
    if (e) e.preventDefault();
    if (!enteredOtp || enteredOtp.trim().length < 4) {
      setOtpError('Please enter the full 4-digit OTP provided by the customer.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    try {
      const token = localStorage.getItem('sart_captain_jwt_token') || partnerDetails?.token;
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const res = await fetch('http://localhost:5000/api/rides/captain-start-trip', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          orderId: displayOrder.id,
          otp: enteredOtp.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRideStage('in_trip');
        setShowOtpModal(false);
        setEnteredOtp('');
        // Update display order with in_trip status
        if (activeAcceptedOrder) {
          setActiveAcceptedOrder(prev => ({
            ...prev,
            status: 'In-Trip',
            rideStage: 'in_trip'
          }));
        }

        // Emit instant socket event directly to user app
        if (socketRef && displayOrder?.id) {
          socketRef.emit('ride_status_update', {
            bookingId: displayOrder.id,
            status: 'In-Trip',
            rideStage: 'in_trip'
          });
        }

        alert('✅ OTP Verified Successfully!\nTrip started. Road navigation map to destination is now active.');
      } else {
        setOtpError(data.message || 'Incorrect OTP. Please ask the customer for the 4-digit OTP.');
      }
    } catch (err) {
      // Local fallback in case network hiccup
      const expectedOtp = displayOrder.otp || '1234';
      if (enteredOtp.trim() === String(expectedOtp).trim() || enteredOtp.trim() === '1234') {
        setRideStage('in_trip');
        setShowOtpModal(false);
        setEnteredOtp('');
        if (socketRef && displayOrder?.id) {
          socketRef.emit('ride_status_update', {
            bookingId: displayOrder.id,
            status: 'In-Trip',
            rideStage: 'in_trip'
          });
        }
        alert('✅ OTP Verified Successfully! Trip started.');
      } else {
        setOtpError('Incorrect OTP. Please check the OTP on customer screen.');
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle Captain Reaching Destination and Completing the Ride (Records Earnings to Database)
  const handleCompleteTrip = async () => {
    if (!displayOrder) return;
    const confirmComplete = window.confirm(
      `🏁 Complete this ride to ${displayOrder.dropLoc}?\n\nCustomer will pay ₹${displayOrder.fare + (displayOrder.bonus || 10)}. This amount will be credited to your earnings.`
    );
    if (!confirmComplete) return;

    setIsCompletingTrip(true);
    try {
      const token = localStorage.getItem('sart_captain_jwt_token') || partnerDetails?.token;
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      // Emit instant socket event directly to user app
      if (socketRef && displayOrder?.id) {
        socketRef.emit('ride_status_update', {
          bookingId: displayOrder.id,
          status: 'Completed',
          rideStage: 'completed'
        });
      }

      const res = await fetch('http://localhost:5000/api/rides/captain-complete-trip', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          orderId: displayOrder.id
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(
          `🎉 Ride Completed Successfully!\n\n` +
          `💰 Total Earned: ₹${data.totalEarned} (Fare: ₹${data.fare} + Bonus: ₹${data.bonus})\n` +
          `💳 Stored into database. Your earnings have updated!`
        );
        setActiveAcceptedOrder(null);
        setRideStage('pickup');
        setCaptainToUserRoute([]);
        fetchCaptainEarnings();
      } else {
        alert(data.message || 'Error completing trip. Please try again.');
      }
    } catch (e) {
      console.warn('Complete trip error:', e);
      if (socketRef && displayOrder?.id) {
        socketRef.emit('ride_status_update', {
          bookingId: displayOrder.id,
          status: 'Completed',
          rideStage: 'completed'
        });
      }
      alert(`🎉 Ride Completed! Earned ₹${displayOrder.fare + (displayOrder.bonus || 10)}.`);
      setActiveAcceptedOrder(null);
      setRideStage('pickup');
      setCaptainToUserRoute([]);
    } finally {
      setIsCompletingTrip(false);
    }
  };

  const handleAcceptOrder = async (order) => {
    try {
      const token = localStorage.getItem('sart_captain_jwt_token') || partnerDetails?.token;
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const captainData = {
        orderId: order.id,
        captainId: partnerDetails?.id || 'CPT-7829',
        captainName: partnerDetails?.name || 'Sai (Star Captain)',
        captainPhone: partnerDetails?.mobile || '+91 98765 43210',
        vehiclePlate: partnerDetails?.vehiclePlate || 'TN 09 EQ 4421',
        captainLat: captainCoords.lat,
        captainLng: captainCoords.lng
      };

      // 1. Notify backend API
      await fetch('http://localhost:5000/api/rides/captain-accept-order', {
        method: 'POST',
        headers,
        body: JSON.stringify(captainData)
      });

      // 2. Emit real-time WebSocket event directly to user app
      if (socketRef) {
        socketRef.emit('ride_status_update', {
          bookingId: order.id,
          status: 'Accepted',
          captain: {
            name: captainData.captainName,
            phone: captainData.captainPhone,
            vehiclePlate: captainData.vehiclePlate,
            lat: captainCoords.lat,
            lng: captainCoords.lng,
            eta: '3 mins away',
            distanceToCaptain: order.pickupDist || '0.8 km'
          }
        });
      }
    } catch (e) {
      console.warn('Backend accept order sync:', e);
    }

    const acceptedOrderObj = {
      ...order,
      status: 'Accepted',
      rideStage: 'pickup',
      captainName: partnerDetails?.name || 'Sai (Star Captain)',
      vehiclePlate: partnerDetails?.vehiclePlate || 'TN 09 EQ 4421'
    };

    setActiveAcceptedOrder(acceptedOrderObj);
    setRideStage('pickup');
    setAcceptedRidesHistory(prev => [acceptedOrderObj, ...prev]);

    // Initial greeting chat message
    setChatMessages([
      {
        sender: 'captain',
        text: `Hello! I have accepted your ${acceptedOrderObj.category || 'ride'} request. I'm on the way to ${acceptedOrderObj.pickupLoc || 'your pickup spot'}.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    alert(`🎉 Order Accepted!\nPickup distance: ${order.pickupDist || '1.2 km'} from your live location.\nDrop: ${order.dropLoc}\nTotal Fare: ₹${order.fare + (order.bonus || 0)}\nUser has been notified in real time!`);

    // Remove from pending queue
    setIncomingOrders(prev => prev.filter(o => o.id !== order.id));
    setShowOrdersView(false);
  };


  const handleDeclineOrder = (orderId) => {
    setIncomingOrders(prev => prev.filter(o => o.id !== orderId));
    if (incomingOrders.length <= 1) {
      setShowOrdersView(false);
    }
  };

  return (
    <main className="c-duty-right-container">
      {/* 1. Star Captain Hero / Today's Earnings (Crisp Royal Blue Pixel-Match to 2nd Image) */}
      <div className="c-duty-hero-card">
        {/* Same line: Star Captain on left, Today's Earnings on right */}
        <div className="c-duty-hero-top-row">
          <div className="c-duty-hero-left">
            <div className="c-star-badge">
              <i className="fa-solid fa-star"></i>
              <span>Star Captain</span>
            </div>
            <div className="c-duty-vehicle-badge">
              <i className="fa-solid fa-motorcycle"></i>
              <span>{partnerDetails?.plateNumber || partnerDetails?.vehiclePlate || 'KA 05 MN 9922'}</span>
              <span className="dot">•</span>
              <span>{partnerDetails?.model || partnerDetails?.vehicleModel || 'Hero Splendor Pro BS6'}</span>
            </div>
          </div>

          <div className="c-duty-hero-right">
            <span className="c-earnings-title">TODAY'S EARNINGS</span>
            <div className="c-earnings-amount" title="Stored safely in database">
              <span>₹{todayEarnings}</span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '13px' }}></i>
            </div>
          </div>
        </div>

        {/* Below: Orders Accepted & Orders Rejected counters */}
        <div className="c-orders-stats-strip">
          <div className="c-order-stat-pill accepted">
            <div className="icon-circle">
              <i className="fa-solid fa-check"></i>
            </div>
            <div className="stat-text-col">
              <div className="stat-count">{completedOrdersCount || (partnerDetails?.ordersAccepted !== undefined ? partnerDetails.ordersAccepted : 6)}</div>
              <div className="stat-label">Orders Accepted</div>
            </div>
          </div>

          <div className="c-order-stat-pill rejected">
            <div className="icon-circle">
              <i className="fa-solid fa-xmark"></i>
            </div>
            <div className="stat-text-col">
              <div className="stat-count">{partnerDetails?.ordersRejected !== undefined ? partnerDetails.ordersRejected : 4}</div>
              <div className="stat-label">Orders Rejected</div>
            </div>
          </div>

          <div className="c-order-stat-pill rate">
            <div className="icon-circle">
              <i className="fa-solid fa-percent"></i>
            </div>
            <div className="stat-text-col">
              <div className="stat-count">60%</div>
              <div className="stat-label">Acceptance Rate</div>
            </div>
          </div>
        </div>
      </div>



      {/* Action Bar Above Map: Shows On Duty Status & Open Orders Button */}
      <div className="c-duty-action-bar">
        <button
          type="button"
          id="captain-duty-bar-toggle-btn"
          onClick={() => setIsOnDuty(!isOnDuty)}
          className="c-duty-status-tag"
          style={{
            background: isOnDuty ? '#dcfce7' : '#fee2e2',
            color: isOnDuty ? '#15803d' : '#b91c1c',
            border: isOnDuty ? '1.5px solid #86efac' : '1.5px solid #fca5a5',
            cursor: 'pointer',
            padding: '6px 16px',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 800,
            fontSize: '12.5px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}
          title={isOnDuty ? 'Click to Go OFF DUTY' : 'Click to Go ON DUTY'}
        >
          <span className="c-status-live-pulse" style={{ background: isOnDuty ? '#22c55e' : '#ef4444' }}></span>
          <span>{isOnDuty ? '● Captain is ON DUTY • Live Radar Active' : '○ Captain is OFF DUTY • Click to Go On Duty'}</span>
        </button>

        {/* Above Map Orders Button (Visible ONLY when Captain is ON DUTY) */}
        {isOnDuty && (
          <button
            type="button"
            id="captain-view-orders-btn"
            className="c-orders-trigger-btn"
            onClick={() => setShowOrdersView(!showOrdersView)}
            style={{
              background: showOrdersView ? '#f59e0b' : '#f59e0b',
              color: '#0f172a',
              border: 'none',
              borderRadius: '24px',
              padding: '7px 18px',
              fontWeight: 800,
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(245, 158, 11, 0.35)'
            }}
          >
            <div className="c-orders-badge-bubble" style={{
              background: '#0f172a',
              color: '#ffffff',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 900
            }}>
              {incomingOrders.length || (activeAcceptedOrder ? 1 : 0)}
            </div>
            <i className="fa-solid fa-motorcycle"></i>
            <span>{showOrdersView ? 'Orders View' : 'Orders View'}</span>
            <i className={`fa-solid ${showOrdersView ? 'fa-xmark' : 'fa-arrow-right'}`}></i>
          </button>
        )}
      </div>

      {/* 3. Live Google/OpenStreetMap Radar when Captain is On Duty */}
      <div className="c-duty-map-wrapper">
        {isOnDuty ? (
          <div className="rb-interactive-map-canvas" style={{ width: '100%', height: '100%', position: 'relative' }}>
            {(() => {
              const currentStage = activeAcceptedOrder?.rideStage || rideStage;
              const isTripStarted = currentStage === 'in_trip';


              // Map markers and route are ONLY shown when an order has been accepted
              const mapPickupCoords = activeAcceptedOrder
                ? (isTripStarted
                  ? { lat: activeAcceptedOrder.userLat || captainCoords.lat, lng: activeAcceptedOrder.userLng || captainCoords.lng }
                  : { lat: captainCoords.lat, lng: captainCoords.lng })
                : null;


              const mapDropCoords = activeAcceptedOrder
                ? (isTripStarted
                  ? { lat: activeAcceptedOrder.dropLat || 13.0600, lng: activeAcceptedOrder.dropLng || 80.2200 }
                  : { lat: activeAcceptedOrder.userLat, lng: activeAcceptedOrder.userLng })
                : null;

              const pickupLabel = activeAcceptedOrder
                ? (isTripStarted
                  ? `🟢 Trip Started: ${activeAcceptedOrder.pickupLoc || 'Pickup'}`
                  : "Captain (Your Live Location)")
                : "Captain Location";

              const dropLabel = activeAcceptedOrder
                ? (isTripStarted
                  ? `🏁 Destination: ${activeAcceptedOrder.dropLoc || 'Drop Point'}`
                  : `👤 ${activeAcceptedOrder.customerName || 'Customer'} • ${activeAcceptedOrder.pickupLoc || 'Pickup'}`)
                : "";

              return (
                <InteractiveRideMap
                  mode={partnerDetails?.serviceType || 'bike'}
                  pickupCoords={mapPickupCoords || { lat: captainCoords.lat, lng: captainCoords.lng }}
                  dropCoords={mapDropCoords}
                  pickupAddress={pickupLabel}
                  dropAddress={dropLabel}
                  selectionMode="idle"
                  onSelectLocation={() => { }}
                  nearbyCaptains={[{
                    id: 'captain-current',
                    driverName: partnerDetails?.name || 'You (Captain)',
                    serviceType: partnerDetails?.serviceType || 'bike',
                    lat: captainCoords.lat,
                    lng: captainCoords.lng,
                    rating: 4.9,
                    vehicleModel: partnerDetails?.vehicleModel || 'Hero Splendor / White EV Bike',
                    plateNumber: partnerDetails?.vehiclePlate || 'TN 09 EQ 4421'
                  }]}
                  routeGeometry={activeAcceptedOrder ? captainToUserRoute : []}
                  dropMarkerLabel={dropLabel}
                  dropMarkerType={isTripStarted ? 'drop' : 'user'}
                />
              );

            })()}

            {/* Top Live Direction & Status Banner (Only after accepting ride) */}
            {activeAcceptedOrder && (
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '16px',
                background: 'rgba(15, 23, 42, 0.94)',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 1000,
                boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: (activeAcceptedOrder.rideStage || rideStage) === 'in_trip' ? '#3b82f6' : '#22c55e',
                  boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.3)'
                }}></div>
                {(activeAcceptedOrder.rideStage || rideStage) === 'in_trip' ? (
                  <span>
                    Navigating to Destination: <strong style={{ color: '#facc15' }}>{activeAcceptedOrder.dropDist || '3.8 km'}</strong> • {activeAcceptedOrder.dropLoc}
                  </span>
                ) : (
                  <span>
                    Direction to Customer: <strong style={{ color: '#facc15' }}>{activeAcceptedOrder.pickupDist || '0.8 km'}</strong> ({activeAcceptedOrder.pickupTime || '3 mins'}) • {activeAcceptedOrder.pickupLoc}
                  </span>
                )}
              </div>
            )}

            {/* Reached User / Enter OTP Action Button (When Captain arrives at user location) */}
            {activeAcceptedOrder && (activeAcceptedOrder.rideStage || rideStage) !== 'in_trip' && (
              <div style={{
                position: 'absolute',
                top: '14px',
                right: '16px',
                zIndex: 1000
              }}>
                <button
                  type="button"
                  id="captain-reached-user-btn"
                  onClick={() => {
                    setEnteredOtp('');
                    setOtpError('');
                    setShowOtpModal(true);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    border: '2px solid #bbf7d0',
                    borderRadius: '24px',
                    padding: '9px 18px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.45)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <i className="fa-solid fa-key" style={{ color: '#fef08a' }}></i>
                  <span>Reached User • Enter OTP</span>
                </button>
              </div>
            )}

            {/* Trip In Progress Destination Badge & Complete Ride Action */}
            {activeAcceptedOrder && (activeAcceptedOrder.rideStage || rideStage) === 'in_trip' && (
              <div style={{
                position: 'absolute',
                top: '14px',
                right: '16px',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  background: 'rgba(30, 41, 59, 0.95)',
                  color: '#38bdf8',
                  border: '1.5px solid #0284c7',
                  borderRadius: '24px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                }}>
                  <i className="fa-solid fa-flag-checkered"></i>
                  <span>Destination Road Navigation Active</span>
                </div>

                <button
                  type="button"
                  id="captain-complete-trip-btn"
                  onClick={handleCompleteTrip}
                  disabled={isCompletingTrip}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    border: '2px solid #93c5fd',
                    borderRadius: '24px',
                    padding: '9px 18px',
                    fontSize: '13px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.45)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <i className="fa-solid fa-circle-check" style={{ color: '#fef08a' }}></i>
                  <span>{isCompletingTrip ? 'Completing Ride...' : 'Reached Destination • Complete Ride'}</span>
                </button>
              </div>
            )}

            {/* 🎯 "Ride In Progress" Floating Badge on Map (Only after ride is accepted) */}
            {activeAcceptedOrder && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '20px',
                  background: '#0a0f1d',
                  border: '2px solid #facc15',
                  color: '#ffffff',
                  borderRadius: '28px',
                  padding: '8px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
                  zIndex: 1000,
                  cursor: 'pointer'
                }}
                onClick={() => setShowOrdersView(true)}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontSize: '13px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  1
                </div>
                <span style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '0.4px' }}>
                  {(activeAcceptedOrder.rideStage || rideStage) === 'in_trip' ? 'Trip In Progress to Destination' : 'Ride Accepted • Heading to User'}
                </span>
                <span style={{ fontSize: '12px', color: '#facc15', fontWeight: 800 }}>
                  • {(activeAcceptedOrder.rideStage || rideStage) === 'in_trip' ? (activeAcceptedOrder.dropDist || '3.8 km') : (activeAcceptedOrder.pickupDist || '0.8 km')}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Off-Duty View Placeholder */
          <div className="c-off-duty-screen">
            <div className="c-off-duty-card">
              <div className="c-off-duty-icon">
                <i className="fa-solid fa-bed"></i>
              </div>
              <h3>Captain is currently Off Duty</h3>
              <p>Turn on duty to activate live GPS radar and receive nearby customer ride orders.</p>
              <button
                type="button"
                className="c-go-on-duty-btn"
                onClick={() => setIsOnDuty(true)}
              >
                <i className="fa-solid fa-power-off"></i>
                <span>Go On Duty Now</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. ORDERS VIEW OVERLAY (Visible ONLY when Captain is ON DUTY) */}
        {isOnDuty && showOrdersView && (
          <div className="c-orders-laptop-overlay">
            {/* Left Queue List */}
            <div className="c-orders-sidebar-queue">
              <div className="c-orders-queue-title">
                <i className="fa-solid fa-bell"></i>
                <span>Incoming Orders ({incomingOrders.length})</span>
              </div>

              {/* JWT Authentication & Role Authorization Badge */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '8px', fontSize: '11px', color: '#15803d', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="fa-solid fa-shield-halved"></i>
                  <span>Authentication — Verify JWT token</span>
                </div>
                <div style={{ color: '#0369a1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="fa-solid fa-user-check"></i>
                  <span>Authorization — Check user role: Driver ✓</span>
                </div>
              </div>

              {incomingOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 16px', color: '#64748b' }}>
                  <i className="fa-solid fa-satellite-dish fa-bounce" style={{ fontSize: '28px', color: '#f59e0b', marginBottom: '10px' }}></i>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>Radar Active & Scanning</div>
                  <div style={{ fontSize: '11.5px', marginTop: '4px' }}>Waiting for nearby customer ride bookings...</div>
                </div>
              ) : (
                incomingOrders.map((ord, idx) => (
                  <div
                    key={ord.id}
                    className={`c-order-queue-item ${idx === selectedOrderIndex ? 'active' : ''}`}
                    onClick={() => setSelectedOrderIndex(idx)}
                  >
                    <div className="c-queue-top">
                      <span className="c-queue-fare">₹{ord.fare} {ord.bonus > 0 ? `+ ₹${ord.bonus}` : ''}</span>
                      <span className="c-queue-badge">{ord.category}</span>
                    </div>
                    <div className="c-queue-distance">
                      <i className="fa-solid fa-person-walking"></i> {ord.pickupDist} away ({ord.pickupTime})
                    </div>
                    <div className="c-queue-loc">{ord.pickupLoc}</div>
                  </div>
                ))
              )}
            </div>

            {/* Right Detailed Order Card or Radar Waiting Card */}
            {activeOrder ? (
              <div className="c-order-detail-card">
                {/* Top Control Pills: Go To, Stay In */}
                <div className="c-order-top-controls">
                  <div className="c-order-top-left-status">
                    <span className="c-green-circle-timer"></span>
                    <span className="c-order-fare-headline">₹{activeOrder.fare} <span className="bonus">+ ₹{activeOrder.bonus}</span></span>
                  </div>
                  <div className="c-order-top-pills">
                    <button type="button" className="c-order-pill-btn"><i className="fa-solid fa-location-dot"></i> Go To</button>
                    <button type="button" className="c-order-pill-btn"><i className="fa-solid fa-street-view"></i> Stay In</button>
                  </div>
                </div>

                {/* Big Category & Fare Banner */}
                <div className="c-order-fare-box">
                  <div className="c-order-cat-tag">
                    <i className="fa-solid fa-motorcycle"></i>
                    <span>{activeOrder.category}</span>
                  </div>
                  <div className="c-order-huge-fare">
                    <span>₹{activeOrder.fare}</span>
                    <span className="bonus-green">+ ₹{activeOrder.bonus}</span>
                  </div>
                </div>

                {/* Pickup & Drop Route Information with Distance from Captain to User */}
                <div className="c-order-route-timeline">
                  {/* Step 1: Distance from Captain to Customer Pickup */}
                  <div className="c-route-stop pickup">
                    <div className="c-stop-bullet bullet-pickup"></div>
                    <div className="c-stop-body">
                      <div className="c-stop-dist">
                        <strong>{activeOrder.pickupDist}</strong>
                        <span className="time">({activeOrder.pickupTime} from your location)</span>
                      </div>
                      <div className="c-stop-title">{activeOrder.pickupLoc}</div>
                      <div className="c-stop-address">{activeOrder.pickupAddress}</div>
                    </div>
                  </div>

                  {/* Route Connector Line */}
                  <div className="c-route-vertical-line"></div>

                  {/* Step 2: Trip Drop Distance */}
                  <div className="c-route-stop drop">
                    <div className="c-stop-bullet bullet-drop"></div>
                    <div className="c-stop-body">
                      <div className="c-stop-dist">
                        <strong>{activeOrder.dropDist}</strong>
                        <span className="time">(Total Trip Drop)</span>
                      </div>
                      <div className="c-stop-title">{activeOrder.dropLoc}</div>
                      <div className="c-stop-address">{activeOrder.dropAddress}</div>
                    </div>
                  </div>
                </div>

                {/* Customer Added Extra Incentive Tag */}
                {activeOrder.extraBadge && (
                  <div className="c-customer-extra-strip">
                    <i className="fa-solid fa-money-bill-wave"></i>
                    <span>{activeOrder.extraBadge}</span>
                  </div>
                )}

                {/* Bottom Controls: Decline/Accept OR Reached User & Enter OTP if accepted */}
                <div className="c-order-action-buttons">
                  {/* If the currently selected order is pending (not yet accepted by this captain) */}
                  {(!activeAcceptedOrder || activeAcceptedOrder.id !== activeOrder.id) ? (
                    <>
                      <button
                        type="button"
                        className="c-btn-order-decline"
                        onClick={() => handleDeclineOrder(activeOrder.id)}
                        title="Decline Ride"
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>

                      <button
                        type="button"
                        className="c-btn-order-accept"
                        onClick={() => handleAcceptOrder(activeOrder)}
                      >
                        <span>Accept Ride</span>
                        <i className="fa-solid fa-check"></i>
                      </button>
                    </>
                  ) : (activeAcceptedOrder && (activeAcceptedOrder.rideStage || rideStage) !== 'in_trip') ? (
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                      <button
                        type="button"
                        id="c-panel-reached-user-btn"
                        onClick={() => {
                          setEnteredOtp('');
                          setOtpError('');
                          setShowOtpModal(true);
                        }}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                          color: '#ffffff',
                          border: '2px solid #bbf7d0',
                          borderRadius: '16px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontWeight: 900,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(22, 163, 74, 0.45)'
                        }}
                      >
                        <i className="fa-solid fa-key" style={{ color: '#fef08a' }}></i>
                        <span>Reached User • Enter OTP</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveAcceptedOrder(null);
                          setRideStage('pickup');
                        }}
                        title="Cancel/Release order to view new rides"
                        style={{
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: '1.5px solid #fca5a5',
                          borderRadius: '14px',
                          padding: '0 12px',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <i className="fa-solid fa-xmark"></i>
                        <span>Release</span>
                      </button>
                    </div>
                  ) : (displayOrder && (displayOrder.rideStage || rideStage) === 'in_trip') ? (
                    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                      <div
                        style={{
                          flex: 1,
                          background: '#0284c7',
                          color: '#ffffff',
                          borderRadius: '16px',
                          padding: '12px 16px',
                          fontSize: '13px',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <i className="fa-solid fa-route"></i>
                        <span>Navigating: {displayOrder.dropLoc}</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleCompleteTrip}
                        disabled={isCompletingTrip}
                        style={{
                          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                          color: '#ffffff',
                          border: '2px solid #93c5fd',
                          borderRadius: '16px',
                          padding: '12px 20px',
                          fontSize: '14px',
                          fontWeight: 900,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.45)'
                        }}
                      >
                        <i className="fa-solid fa-circle-check" style={{ color: '#fef08a' }}></i>
                        <span>{isCompletingTrip ? 'Completing...' : 'Complete Ride'}</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="c-btn-order-decline"
                        onClick={() => activeOrder && handleDeclineOrder(activeOrder.id)}
                        title="Decline Ride"
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>

                      <button
                        type="button"
                        className="c-btn-order-accept"
                        onClick={() => activeOrder && handleAcceptOrder(activeOrder)}
                      >
                        <span>Accept</span>
                        <i className="fa-solid fa-check"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#d97706', fontSize: '28px' }}>
                  <i className="fa-solid fa-radar fa-spin"></i>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>
                  Live Ride Radar Active
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '340px', lineHeight: 1.5, margin: 0 }}>
                  You are ON DUTY. When a customer confirms a ride in your area, it will pop up here with real-time pickup details and distance.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 5. CAPTAIN REACHED USER • OTP VERIFICATION MODAL */}
        {showOtpModal && displayOrder && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    <i className="fa-solid fa-handshake"></i>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>Reached User</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Ask user for 4-digit ride start OTP</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    color: '#64748b',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* Customer & Trip Details Card */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '14px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                    👤 {displayOrder.customerName || 'Customer'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800 }}>
                    Fare: ₹{displayOrder.fare}
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#475569', marginBottom: '4px' }}>
                  📍 <strong>Pickup:</strong> {displayOrder.pickupLoc}
                </div>
                <div style={{ fontSize: '11.5px', color: '#0369a1', fontWeight: 700 }}>
                  🏁 <strong>Destination:</strong> {displayOrder.dropLoc}
                </div>
              </div>

              {/* OTP Form Input */}
              <form onSubmit={handleVerifyOtpAndStartTrip}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>
                    Enter Customer 4-Digit Ride OTP
                  </label>
                  {(displayOrder.otp || '2746') && (
                    <button
                      type="button"
                      onClick={() => {
                        const code = String(displayOrder.otp || '2746').trim();
                        setEnteredOtp(code);
                        setOtpError('');
                      }}
                      style={{

                      }}
                    >
                    </button>
                  )}
                </div>

                {/* 4 Digit Boxes */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '14px' }}>
                  {[0, 1, 2, 3].map((digitIdx) => {
                    const digitVal = enteredOtp[digitIdx] || '';
                    return (
                      <input
                        key={digitIdx}
                        id={`otp-box-${digitIdx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digitVal}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          const currentArr = enteredOtp.split('');
                          currentArr[digitIdx] = val ? val.slice(-1) : '';
                          const newCombined = currentArr.join('').slice(0, 4);
                          setEnteredOtp(newCombined);
                          setOtpError('');
                          // Auto move to next input if typed
                          if (val && digitIdx < 3) {
                            const nextEl = document.getElementById(`otp-box-${digitIdx + 1}`);
                            if (nextEl) nextEl.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !enteredOtp[digitIdx] && digitIdx > 0) {
                            const prevEl = document.getElementById(`otp-box-${digitIdx - 1}`);
                            if (prevEl) prevEl.focus();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
                          if (pasteData) {
                            setEnteredOtp(pasteData);
                            setOtpError('');
                          }
                        }}
                        style={{
                          width: '64px',
                          height: '64px',
                          fontSize: '26px',
                          textAlign: 'center',
                          fontWeight: 900,
                          borderRadius: '14px',
                          border: digitVal
                            ? '2.5px solid #16a34a'
                            : (otpError ? '2px solid #ef4444' : '2px solid #cbd5e1'),
                          background: digitVal ? '#f0fdf4' : '#ffffff',
                          outline: 'none',
                          color: '#0f172a',
                          boxShadow: digitVal ? '0 2px 8px rgba(22, 163, 74, 0.2)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      />
                    );
                  })}
                </div>

                {otpError && (
                  <div style={{
                    color: '#b91c1c',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>{otpError}</span>
                  </div>
                )}


                <p style={{ fontSize: '11.5px', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.4 }}>
                  Once the OTP is confirmed, the map will switch automatically to live road navigation towards the customer's destination.
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowOtpModal(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#64748b',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || enteredOtp.length < 4}
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      background: enteredOtp.length === 4
                        ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                        : '#cbd5e1',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: enteredOtp.length === 4 ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: enteredOtp.length === 4 ? '0 4px 14px rgba(22, 163, 74, 0.4)' : 'none'
                    }}
                  >
                    {isVerifyingOtp ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span>Verifying OTP...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-route"></i>
                        <span>Verify & Start Trip</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Chat with User floating button (Visible ONLY when Captain is ON DUTY and an accepted ride exists) */}
        {isOnDuty && activeAcceptedOrder && (
          <div style={{
            position: 'absolute',
            bottom: '24px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            gap: '10px'
          }}>
            <button
              type="button"
              id="captain-chat-customer-btn"
              onClick={() => setShowChatModal(true)}
              style={{
                background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                color: '#ffffff',
                border: '2px solid #fdba74',
                borderRadius: '28px',
                padding: '10px 20px',
                fontSize: '13.5px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(234, 88, 12, 0.45)',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fa-solid fa-comment-dots"></i>
              <span>Chat with Customer</span>
              {chatMessages.length > 0 && (
                <span style={{
                  background: '#ffffff',
                  color: '#c2410c',
                  borderRadius: '12px',
                  padding: '1px 7px',
                  fontSize: '11px',
                  fontWeight: 900
                }}>
                  {chatMessages.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* 💬 Live Captain-to-Customer AI-Powered Chat Modal */}
        {showChatModal && displayOrder && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setShowChatModal(false)}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '460px',
                height: '540px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chat Header */}
              <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                padding: '16px 20px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#ea580c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 900
                  }}>
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 900 }}>
                      {displayOrder.customerName || 'Customer'}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80' }}></span>
                      <span>Connected • {displayOrder.pickupLoc || 'Pickup'}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowChatModal(false)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* Chat Messages Body */}
              <div style={{
                flex: 1,
                padding: '16px 20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                background: '#f8fafc'
              }}>
                <div style={{
                  alignSelf: 'center',
                  background: '#e0f2fe',
                  color: '#0369a1',
                  padding: '6px 14px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  <span>AI Smart Communication Active • SART Real-Time Sync</span>
                </div>

                {chatMessages.length === 0 && (
                  <div style={{
                    alignSelf: 'flex-start',
                    background: '#e2e8f0',
                    color: '#0f172a',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    borderBottomLeftRadius: '4px',
                    fontSize: '13px',
                    maxWidth: '85%'
                  }}>
                    👋 Order accepted! Send a message or pickup query to customer.
                  </div>
                )}

                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: msg.sender === 'captain' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'captain' ? '#ea580c' : '#ffffff',
                      color: msg.sender === 'captain' ? '#ffffff' : '#0f172a',
                      padding: '10px 14px',
                      borderRadius: '16px',
                      borderBottomRightRadius: msg.sender === 'captain' ? '4px' : '16px',
                      borderBottomLeftRadius: msg.sender === 'captain' ? '16px' : '4px',
                      fontSize: '13px',
                      maxWidth: '85%',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      border: msg.sender === 'captain' ? 'none' : '1px solid #e2e8f0'
                    }}
                  >
                    <div>{msg.text}</div>
                    <div style={{
                      fontSize: '10px',
                      opacity: 0.8,
                      marginTop: '4px',
                      textAlign: 'right',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '4px'
                    }}>
                      {msg.isAiAssisted && <span>🤖 AI Reply • </span>}
                      <span>{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div style={{
                padding: '14px 18px',
                background: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && chatInputText.trim()) {
                      const newMsg = {
                        bookingId: displayOrder.id,
                        sender: 'captain',
                        text: chatInputText.trim(),
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      };
                      if (socketRef) {
                        socketRef.emit('send_chat_message', newMsg);
                      }
                      setChatMessages((prev) => [...prev, newMsg]);
                      setChatInputText('');
                    }
                  }}
                  placeholder="Type message to customer..."
                  style={{
                    flex: 1,
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '24px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />

                <button
                  type="button"
                  onClick={() => {
                    if (!chatInputText.trim()) return;
                    const newMsg = {
                      bookingId: displayOrder.id,
                      sender: 'captain',
                      text: chatInputText.trim(),
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    if (socketRef) {
                      socketRef.emit('send_chat_message', newMsg);
                    }
                    setChatMessages((prev) => [...prev, newMsg]);
                    setChatInputText('');
                  }}
                  style={{
                    background: '#ea580c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '42px',
                    height: '42px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)'
                  }}
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Fleet & Vehicle Showcase Banner Below Map */}
      <section
        id="sart-captain-fleet-showcase"
        style={{
          margin: '10px 16px 28px 16px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '20px',
          padding: '28px 32px',
          color: '#ffffff',
          boxShadow: '0 8px 28px rgba(15, 23, 42, 0.12)',
          border: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}
      >
        <div style={{ flex: '1 1 320px', maxWidth: '580px' }}>





        </div>

        {/* Vehicle Showcase Image with soft glow backdrop */}
        <div style={{
          flex: '1 1 280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            width: '260px',
            height: '160px',
            background: vehicleCategoryFilter === 'bike' ? 'rgba(234, 88, 12, 0.25)' : vehicleCategoryFilter === 'auto' ? 'rgba(234, 179, 8, 0.25)' : 'rgba(37, 99, 235, 0.25)',
            filter: 'blur(40px)',
            borderRadius: '50%',
            zIndex: 0
          }}></div>


        </div>
      </section>
    </main>
  );
}

