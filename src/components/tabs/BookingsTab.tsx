import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './BookingsTab.css';
import { useSartStore } from '@/store/useSartStore';
import RoadBooking from '../booking-pages/road';
import SeaBooking from '../booking-pages/sea';
import AirBooking from '../booking-pages/air';
import TrainBooking from '../booking-pages/train';
import { FLEET_CATEGORIES, FLEET_ITEMS, MOCK_BOOKINGS, Booking } from '../../data/mockBookings';

export default function BookingsTab() {
  const pathname = usePathname();

  const [selectedFleetCategory, setSelectedFleetCategory] = useState('All Fleet');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(() => {
    if (pathname && pathname.startsWith('/booking')) {
      const slugParts = pathname.split('/');
      const slug = slugParts[slugParts.length - 1];
      if (slug && slug !== 'booking') {
        const match = FLEET_ITEMS.find(item => item.id.toLowerCase() === slug.toLowerCase());
        if (match) return match.id;
      }
    }
    return null;
  });

  const [notFoundService, setNotFoundService] = useState<string | null>(() => {
    if (pathname && pathname.startsWith('/booking')) {
      const slugParts = pathname.split('/');
      const slug = slugParts[slugParts.length - 1];
      if (slug && slug !== 'booking') {
        const match = FLEET_ITEMS.find(item => item.id.toLowerCase() === slug.toLowerCase());
        if (!match) return slug;
      }
    }
    return null;
  });
  const [pnrInput, setPnrInput] = useState('');
  const [trackingType, setTrackingType] = useState('Train — PNR');
  const [dateInput, setDateInput] = useState('');
  const [trackedBooking, setTrackedBooking] = useState<Booking | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [overviewTab, setOverviewTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [selectedGlobalBooking, setSelectedGlobalBooking] = useState<Booking | null>(null);
  const [showMoreDestinations, setShowMoreDestinations] = useState(false);

  const { activeTab: globalActiveTab, setActiveTab: setGlobalActiveTab } = useSartStore();

  // URL parsing is now handled efficiently in the initial useState logic above!

  const router = useRouter();

  const handleBackToFleet = () => {
    setSelectedVehicleType(null);
    window.history.pushState(null, '', '/booking');
  };

  const handleSelectFleetItem = (item: any) => {
    setSelectedVehicleType(item.id);
    setNotFoundService(null);
    window.history.pushState(null, '', `/booking/${item.id}`);
  };

  const getCategory = (id: string) => {
    if (['bike', 'auto', 'car', 'suv', 'bus'].includes(id)) return 'Road';
    if (['boat', 'ship'].includes(id)) return 'Sea';
    if (['aeroplane', 'helicopter'].includes(id)) return 'Air';
    if (['train'].includes(id)) return 'Train';
    return '';
  };

  const handlePnrSearch = () => {
    setSearchError(null);
    if (!pnrInput.trim()) {
      setSearchError('Please enter a valid tracking number');
      return;
    }
    const input = pnrInput.trim().toLowerCase();

    // Check mock bookings first
    let found = MOCK_BOOKINGS.find(b => b.pnr?.toLowerCase() === input || b.bookingId?.toLowerCase() === input);

    // Check global local storage
    if (!found && typeof window !== 'undefined') {
      const globalStr = localStorage.getItem('sart_global_bookings');
      if (globalStr) {
        const globals = JSON.parse(globalStr);
        found = globals.find((b: any) => b.pnr?.toLowerCase() === input || b.bookingId?.toLowerCase() === input);
      }
    }

    if (found) {
      const type = found.type?.toLowerCase() || '';
      const title = found.title.toUpperCase();

      if (trackingType === 'Train — PNR' && type !== 'train' && !title.includes('EXPRESS') && !title.includes('TRAIN')) {
        setSearchError('Not a valid Train PNR. Please select the correct service.');
        return;
      }
      if (trackingType === 'Airline — Flight Number' && type !== 'aeroplane' && !title.includes('AIR') && !title.includes('FLIGHT') && !title.includes('INDIGO')) {
        setSearchError('Not a valid Flight Number. Please select the correct service.');
        return;
      }
      if (trackingType === 'Bus — Ticket Number' && type !== 'bus' && !title.includes('BUS')) {
        setSearchError('Not a valid Bus Ticket Number. Please select the correct service.');
        return;
      }
      if (trackingType === 'Ship / Cruise Ship — IMO Number' && type !== 'ship' && !title.includes('CRUISE') && !title.includes('SHIP')) {
        setSearchError('Not a valid Ship IMO Number. Please select the correct service.');
        return;
      }
      setTrackedBooking(found);
    } else {
      setSearchError('No booking found for this tracking number');
    }
  };

  if (notFoundService) {
    return (
      <section className={`tab-screen ${globalActiveTab === 'booking' ? 'active' : ''}`} id="tab-booking">
        <div className="bookings-tab-container fleet-selection-container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>Service Not Found</h1>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>The service "{notFoundService}" does not exist.</p>
          <button
            onClick={() => {
              setNotFoundService(null);
              window.history.pushState(null, '', '/booking');
            }}
            style={{ padding: '10px 20px', backgroundColor: 'black', color: 'white', borderRadius: '8px', cursor: 'pointer', border: 'none' }}
          >
            Back to Booking
          </button>
        </div>
      </section>
    );
  }

  if (!selectedVehicleType) {
    const displayedFleet = selectedFleetCategory === 'All Fleet'
      ? FLEET_ITEMS
      : FLEET_ITEMS.filter(i => i.category === selectedFleetCategory);

    return (
      <section className={`tab-screen ${globalActiveTab === 'booking' ? 'active' : ''}`} id="tab-booking">
        {/* Global Booking Details Modal */}
        {selectedGlobalBooking && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '800px', background: 'white', borderRadius: '16px', display: 'flex', overflow: 'hidden', maxHeight: '90vh' }}>

              {/* Left: Details */}
              <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#0f172a' }}>{selectedGlobalBooking.title}</h2>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Booking ID: {selectedGlobalBooking.bookingId}</div>
                  </div>
                  <button onClick={() => setSelectedGlobalBooking(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>FROM</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>{selectedGlobalBooking.source}</div>
                      <div style={{ fontSize: '13px', color: '#0f172a' }}>{selectedGlobalBooking.sourceTime}, {selectedGlobalBooking.sourceDate}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>TO</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>{selectedGlobalBooking.destination}</div>
                      <div style={{ fontSize: '13px', color: '#0f172a' }}>{selectedGlobalBooking.destinationTime}, {selectedGlobalBooking.destinationDate}</div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Passenger Name</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>John Doe</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Contact Number</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>+91 9876543210</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Email Address</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>john.doe@example.com</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Address</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>123 Main St, Bangalore, India</div>
                    </div>
                  </div>
                </div>

                {selectedGlobalBooking.isCancelled ? (
                  <>
                    <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', color: '#ef4444' }}>Cancellation & Refund Details</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                      <span style={{ color: '#64748b' }}>Base Fare Paid</span>
                      <span style={{ fontWeight: 'bold' }}>₹4,500</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                      <span style={{ color: '#64748b' }}>Taxes & Fees Paid</span>
                      <span style={{ fontWeight: 'bold' }}>₹320</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>
                      <span style={{ color: '#64748b' }}>Total Amount Paid</span>
                      <span style={{ fontWeight: 'bold' }}>₹4,720</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', marginTop: '16px' }}>
                      <span style={{ color: '#64748b' }}>Cancellation Penalty</span>
                      <span style={{ fontWeight: 'bold', color: '#ef4444' }}>-₹1,200</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                      <span style={{ color: '#64748b' }}>GST & Govt Taxes on Cancellation</span>
                      <span style={{ fontWeight: 'bold', color: '#ef4444' }}>-₹216</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>
                      <span style={{ color: '#64748b' }}>Platform Convenience Fee (Non-refundable)</span>
                      <span style={{ fontWeight: 'bold', color: '#ef4444' }}>-₹100</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', marginBottom: '16px', marginTop: '16px' }}>
                      <span style={{ fontWeight: 'bold', color: '#10b981' }}>Total Refund Amount</span>
                      <span style={{ fontWeight: 'bold', color: '#10b981' }}>₹3,204</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                      <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}><i className="fa-solid fa-check-circle"></i> Refunded Successfully</span>
                      <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>Ref: RFND987654321</span>
                    </div>
                    <p suppressHydrationWarning style={{ fontSize: '12px', color: '#64748b', marginTop: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <strong>Note:</strong> The refund of ₹3,204 has been successfully processed and credited to the original payment method (Credit Card **** 1234) on {new Date().toLocaleDateString('en-IN')}. It may take 3-5 business days to reflect in your bank statement.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Transaction & Payment Details</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                      <span style={{ color: '#64748b' }}>Base Fare</span>
                      <span style={{ fontWeight: 'bold' }}>₹4,500</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                      <span style={{ color: '#64748b' }}>Taxes & Fees</span>
                      <span style={{ fontWeight: 'bold' }}>₹320</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>
                      <span style={{ color: '#64748b' }}>Discount</span>
                      <span style={{ fontWeight: 'bold', color: '#10b981' }}>-₹100</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', marginBottom: '16px' }}>
                      <span style={{ fontWeight: 'bold', color: '#0f172a' }}>Total Amount Paid</span>
                      <span style={{ fontWeight: 'bold', color: '#0f172a' }}>₹4,720</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                      <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>Paid via Credit Card **** 1234</span>
                      <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>Txn ID: TXN987654321</span>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        )}

        <div className="bookings-tab-container fleet-selection-container">

          {/* TRACKING UI */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '40px' }}>
            <div style={{ width: '100%', maxWidth: '900px' }}>
              {trackedBooking ? (
                <div className="tracking-result-screen" style={{ width: '100%' }}>
                  <div className="tracking-result-header">
                    <button className="back-btn" onClick={() => setTrackedBooking(null)}>
                      <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <div>
                      <h4 className="tracking-subtitle">TRACKING RESULT</h4>
                      <h2 className="tracking-title">{trackedBooking.title} - {trackedBooking.number}</h2>
                      <p className="tracking-route">
                        {trackedBooking.source} <i className="fa-solid fa-arrow-right"></i> {trackedBooking.destination}
                      </p>
                    </div>
                  </div>

                  <div className="timeline-card" style={{ marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Status</p>
                        <h3 style={{ margin: '4px 0 0 0', color: '#10b981', fontSize: '18px' }}>{trackedBooking.statusText}</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>PNR / Booking ID</p>
                        <h4 style={{ margin: '4px 0 0 0', fontSize: '16px' }}>{trackedBooking.pnr || trackedBooking.bookingId}</h4>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 45%' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Departure</p>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 'bold' }}>{trackedBooking.sourceTime}, {trackedBooking.sourceDate}</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>{trackedBooking.sourceCode} - {trackedBooking.sourcePlatform || 'Main Terminal'}</p>
                      </div>
                      <div style={{ flex: '1 1 45%' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Arrival</p>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 'bold' }}>{trackedBooking.destinationTime}, {trackedBooking.destinationDate}</p>
                        <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>{trackedBooking.destinationCode} - {trackedBooking.destinationPlatform || 'Main Terminal'}</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '16px' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Passenger Name</p>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', fontSize: '14px' }}>{trackedBooking.passengerName}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Seat / Allocation</p>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', fontSize: '14px' }}>{trackedBooking.seatStatus}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Travel Class</p>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', fontSize: '14px' }}>Economy / General</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Baggage Allowance</p>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', fontSize: '14px' }}>15 Kg (Check-in)</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                      <button style={{ flex: 1, padding: '10px', background: '#f97316', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <i className="fa-solid fa-download"></i> Download Ticket
                      </button>
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: `${trackedBooking.title} Status`,
                              text: `Check out my journey status for ${trackedBooking.title} (${trackedBooking.number}) from ${trackedBooking.source} to ${trackedBooking.destination}. Status: ${trackedBooking.statusText}`,
                              url: window.location.href,
                            }).catch(console.error);
                          } else {
                            alert(`Sharing Status:\n${trackedBooking.title} (${trackedBooking.number})\n${trackedBooking.source} to ${trackedBooking.destination}\nStatus: ${trackedBooking.statusText}`);
                          }
                        }}
                        style={{ flex: 1, padding: '10px', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <i className="fa-solid fa-share-nodes"></i> Share Status
                      </button>
                    </div>

                    {trackedBooking.stops && trackedBooking.stops.length > 0 && (
                      <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#334155' }}>Live Journey Details</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {trackedBooking.stops.map((stop, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '12px', height: '12px', borderRadius: '50%',
                                background: stop.status === 'past' ? '#cbd5e1' : stop.status === 'current' ? '#3b82f6' : '#fff',
                                border: `2px solid ${stop.status === 'future' ? '#cbd5e1' : (stop.status === 'current' ? '#3b82f6' : '#cbd5e1')}`
                              }}></div>
                              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '14px', color: stop.status === 'past' ? '#94a3b8' : '#0f172a', fontWeight: stop.status === 'current' ? 'bold' : 'normal' }}>{stop.name}</span>
                                <span style={{ fontSize: '13px', color: stop.status === 'past' ? '#94a3b8' : '#64748b' }}>{stop.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ background: '#f0f9ff', maxWidth: '850px', margin: '0 auto', padding: '12px 24px', borderRadius: '16px' }}>
                    <div style={{ color: '#0f172a', textAlign: 'center', fontSize: '24px', fontWeight: '900', marginBottom: '4px' }}>
                      Passenger Current Status
                    </div>
                    <div>
                      <div style={{ marginBottom: '4px', textAlign: 'center' }}>
                        <p suppressHydrationWarning style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                          {new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                        </p>
                      </div>

                      {searchError && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', marginTop: '-5px', marginBottom: '10px' }}>{searchError}</p>}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '0' }}>
                        <select
                          value={trackingType}
                          onChange={(e) => setTrackingType(e.target.value)}
                          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#f8fafc', fontWeight: '600', color: '#334155' }}
                        >
                          <option value="Train — PNR">Train — PNR</option>
                          <option value="Airline — Flight Number">Airline — Flight Number</option>
                          <option value="Bus — Ticket Number">Bus — Ticket Number</option>
                          <option value="Ship / Cruise Ship — IMO Number">Ship / Cruise Ship — IMO Number</option>
                        </select>

                        <input
                          type="text"
                          placeholder={trackingType.includes('PNR') ? 'Enter PNR No.' : trackingType.includes('Flight') ? 'Enter Flight No.' : trackingType.includes('Ticket') ? 'Enter Ticket No.' : 'Enter IMO No.'}
                          value={pnrInput}
                          onChange={(e) => setPnrInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handlePnrSearch()}
                          style={{ border: '1px solid #cbd5e1', padding: '10px 16px', fontSize: '14px', width: '300px', outline: 'none', borderRadius: '8px', background: '#f8fafc' }}
                        />

                        <button
                          onClick={handlePnrSearch}
                          style={{ background: '#0f172a', color: 'white', border: 'none', padding: '10px 24px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                        >
                          Check
                        </button>

                        <button
                          onClick={() => setPnrInput('')}
                          style={{ background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', padding: '10px 16px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px' }}
                        >
                          <i className="fa-solid fa-rotate-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* MY BOOKINGS OVERVIEW */}
          <div style={{ maxWidth: '1400px', margin: '0 auto 40px auto', background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <button
                onClick={() => setOverviewTab('upcoming')}
                style={{ background: 'none', border: 'none', borderBottom: overviewTab === 'upcoming' ? '2px solid #6366f1' : '2px solid transparent', padding: '12px 24px', cursor: 'pointer', fontWeight: 'bold', color: overviewTab === 'upcoming' ? '#0f172a' : '#64748b' }}
              >
                Upcoming
              </button>
              <button
                onClick={() => setOverviewTab('past')}
                style={{ background: 'none', border: 'none', borderBottom: overviewTab === 'past' ? '2px solid #6366f1' : '2px solid transparent', padding: '12px 24px', cursor: 'pointer', fontWeight: 'bold', color: overviewTab === 'past' ? '#0f172a' : '#64748b' }}
              >
                Past Bookings
              </button>
              <button
                onClick={() => setOverviewTab('cancelled')}
                style={{ background: 'none', border: 'none', borderBottom: overviewTab === 'cancelled' ? '2px solid #6366f1' : '2px solid transparent', padding: '12px 24px', cursor: 'pointer', fontWeight: 'bold', color: overviewTab === 'cancelled' ? '#0f172a' : '#64748b' }}
              >
                Cancellations
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {MOCK_BOOKINGS.filter(b => {
                if (overviewTab === 'upcoming') return b.isActive && !b.isCancelled;
                if (overviewTab === 'past') return !b.isActive && !b.isCancelled;
                if (overviewTab === 'cancelled') return b.isCancelled;
                return false;
              }).map((booking, idx) => (
                <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {booking.image ? (
                          <img src={booking.image} alt={booking.type} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                        ) : (
                          <i className={`fa-solid ${booking.title.includes('AUTO') ? 'fa-motorcycle' : booking.title.includes('CRUISE') ? 'fa-ship' : booking.title.includes('EXPRESS') ? 'fa-train' : 'fa-plane'}`} style={{ color: '#0f172a' }}></i>
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{booking.number}</div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{booking.title}</div>
                      </div>
                    </div>
                    {overviewTab === 'cancelled' && (
                      <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>CANCELLED</div>
                    )}
                    {overviewTab !== 'cancelled' && (
                      <div style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 'bold' }}>P</div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{booking.sourceCode || booking.source}</div>
                      <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500', marginTop: '4px' }}>{booking.sourceTime}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{booking.sourceDate}</div>
                    </div>
                    <i className="fa-solid fa-arrow-right-long" style={{ color: '#cbd5e1' }}></i>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{booking.destinationCode || booking.destination}</div>
                      <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500', marginTop: '4px' }}>{booking.destinationTime}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{booking.destinationDate}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                    Booking ID {booking.bookingId}
                  </div>

                  {overviewTab === 'cancelled' ? (
                    <button onClick={() => setSelectedGlobalBooking(booking)} style={{ width: '100%', padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Refund Details
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                      <button style={{ flex: 1, padding: '10px 4px', fontSize: '14px', whiteSpace: 'nowrap', background: 'transparent', color: '#0ea5e9', border: '1px solid #0ea5e9', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Download Ticket
                      </button>
                      <button onClick={() => setSelectedGlobalBooking(booking)} style={{ flex: 1, padding: '10px 4px', fontSize: '14px', whiteSpace: 'nowrap', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TOP ROUTES */}
          <div style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Your Rides</h2>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Your frequent journeys this year</p>
              </div>
              <button
                onClick={() => setShowMoreDestinations(!showMoreDestinations)}
                style={{ padding: '8px 24px', background: 'transparent', border: '1px solid #0ea5e9', color: '#0ea5e9', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {showMoreDestinations ? 'View Less' : 'View All'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
              {[
                { from: 'Bengaluru', to: 'Hyderabad', options: '170', img: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=500&q=80', mode: 'Flight' },
                { from: 'Indore', to: 'Bhopal', options: '215', img: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=500&q=80', mode: 'Train' },
                { from: 'Mumbai Port', to: 'Goa Port', options: '170', img: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&w=500&q=80', mode: 'Ship' },
                { from: 'Mumbai', to: 'Chennai', options: '180', img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=500&q=80', mode: 'Car' },
                ...(showMoreDestinations ? [
                  { from: 'Chennai', to: 'Coimbatore', options: '145', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=500&q=80', mode: 'Bus' },
                  { from: 'Mumbai', to: 'Pune', options: '300', img: 'https://thumbs.dreamstime.com/b/passenger-airliner-flight-17934723.jpg', mode: 'Flight' },
                  { from: 'Kochi', to: 'Trivandrum', options: '120', img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=500&q=80', mode: 'Ship' },
                  { from: 'Delhi', to: 'Agra', options: '250', img: 'https://imgd-ct.aeplcdn.com/370x208/n/cw/ec/200003/gravite-exterior-right-front-three-quarter-6.jpeg?isig=0&q=80', mode: 'Car' }
                ] : [])
              ].map((route, i) => (
                <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', background: 'white', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '160px', position: 'relative' }}>
                    <img src={route.img} alt={route.mode} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>{route.mode}</div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#0f172a', marginBottom: '8px' }}>{route.from} <i className="fa-solid fa-arrow-right" style={{ fontSize: '12px', margin: '0 8px', color: '#94a3b8' }}></i> {route.to}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>{route.options} Options</div>
                      <a href="#" style={{ color: '#0ea5e9', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>View <i className="fa-solid fa-angle-right"></i></a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EXCLUSIVE UPSELL OFFERS HEADER */}
          <div style={{ marginTop: '60px', marginBottom: '20px', padding: '32px', background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', borderRadius: '16px', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ maxWidth: '80%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ background: '#f97316', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Special Offers</span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#9a3412', margin: 0 }}>Explore New Ways to Travel!</h2>
              </div>
              <p style={{ margin: 0, color: '#7c2d12', fontSize: '15px', lineHeight: '1.6' }}>
                We noticed you travel frequently by train and bus. Why not upgrade your journey? Check out these exclusive, limited-time offers on flights, luxury cruises, and comfortable cabs curated just for you based on your favorite routes.
              </p>
            </div>
            <div style={{ fontSize: '40px', color: '#ea580c' }}>
              <i className="fa-solid fa-gift"></i>
            </div>
          </div>

          {/* DESTINATIONS / DIRECT FLIGHTS */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#b91c1c', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Your Journey, Our Best Offers</h2>
                <p style={{ color: '#475569', margin: 0, maxWidth: '800px', lineHeight: '1.5' }}>Discover great travel offers that make more destinations affordable. Choose where you want to go, compare your travel options, and start your journey .</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { from: 'Dubai', to: 'Thiruvananthapuram', code: 'DXB - TRV', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=500&q=80' },
                { from: 'Hyderabad', to: 'Chennai', code: 'HYD - MAA', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=500&q=80' },
                { from: 'Dubai', to: 'Hyderabad', code: 'DXB - HYD', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=500&q=80' },
                { from: 'Dubai', to: 'Lucknow', code: 'DXB - LKO', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=500&q=80' },
                { from: 'Bangalore', to: 'Singapore', code: 'BLR - SIN', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=500&q=80' },
                { from: 'Dubai', to: 'Amritsar', code: 'DXB - ATQ', img: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=500&q=80' },
                { from: 'Chennai', to: 'Mangalore', code: 'MAA - IXE', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80' },
                { from: 'Delhi', to: 'Singapore', code: 'DEL - SIN', img: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=500&q=80' }
              ].map((route, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '0', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                  <img src={route.img} alt={`${route.from} to ${route.to}`} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div style={{ padding: '24px 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                      {/* Dotted line connecting the locations */}
                      <div style={{ position: 'absolute', left: '7px', top: '16px', bottom: '16px', borderLeft: '2px dotted #cbd5e1' }}></div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '3px solid #cbd5e1', background: 'white', zIndex: 1 }}></div>
                        <span style={{ fontSize: '15px', color: '#334155', fontWeight: '500' }}>{route.from}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '3px solid #cbd5e1', background: 'white', zIndex: 1 }}></div>
                        <span style={{ fontSize: '15px', color: '#334155', fontWeight: '500' }}>{route.to}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '32px', fontSize: '12px', fontWeight: '700', color: '#e11d48', textTransform: 'uppercase' }}>
                      {route.code}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SHIPS / RECOMMENDED FOR YOU */}
          <div style={{ marginBottom: '60px' }}>

            <h2 style={{ fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', color: '#0f172a' }}>Recommended For You</h2>
            <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <span style={{ paddingBottom: '12px', borderBottom: '2px solid #2563eb', color: '#2563eb', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>Singapore</span>
              <span style={{ paddingBottom: '12px', color: '#64748b', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>Shanghai</span>
              <span style={{ paddingBottom: '12px', color: '#64748b', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>Europe</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {[
                { title: '2 Nights Weekend Getaway Cruise', ship: 'Navigator of the Seas', loc: 'From Singapore, Singapore', price: '$225 USD', img: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&w=400&q=80' },
                { title: '3 Nights Penang Cruise', ship: 'Navigator of the Seas', loc: 'From Singapore, Singapore', price: '$238 USD', img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=400&q=80' },
                { title: '3 Nights Penang Cruise', ship: 'Quantum of the Seas', loc: 'From Singapore, Singapore', price: '$269 USD', img: 'https://www.melancong.my/wp-content/uploads/2021/11/Star-Pisces.jpg' },
                { title: '4 Nights Penang & Phuket Cruise', ship: 'Navigator of the Seas', loc: 'From Singapore, Singapore', price: '$347 USD', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' }
              ].map((cruise, i) => (
                <div key={i}>
                  <img src={cruise.img} alt={cruise.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} />
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#0f172a', fontWeight: 'bold' }}>{cruise.title}</h4>
                  <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
                    <span><i className="fa-solid fa-ship" style={{ width: '16px' }}></i> {cruise.ship}</span>
                    <span><i className="fa-solid fa-location-dot" style={{ width: '16px' }}></i> {cruise.loc}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Starting from*</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>{cruise.price}</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>/person</span>
                  </div>
                  <a href="#" style={{ color: '#2563eb', fontSize: '13px', fontWeight: 'bold', display: 'inline-block', marginTop: '8px', textDecoration: 'none' }}>View dates <i className="fa-solid fa-angle-right"></i></a>
                </div>
              ))}
            </div>
          </div>

          {/* OFFERS SECTION */}
          <div className="offers-section" style={{ marginTop: '48px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: '#0f172a' }}>Special Offers</h2>
            <div className="offers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

              {/* Offer 1 */}
              <div className="offer-card" style={{ background: '#0f172a', borderRadius: '16px', overflow: 'hidden', color: 'white', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ padding: '32px', flex: 1, position: 'relative', zIndex: 1 }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Stand a chance to win</p>
                  <h4 style={{ fontSize: '36px', margin: '0 0 4px 0', fontWeight: '800' }}>2,00,000</h4>
                  <p style={{ fontSize: '15px', color: '#38bdf8', marginBottom: '32px' }}>IndiGo BluChips</p>

                  <p style={{ fontSize: '13px', margin: '0 0 4px 0' }}>Earn <strong style={{ fontSize: '18px' }}>2x</strong> IndiGo BluChips</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>on IndiGoStretch, flights & partner spends</p>
                </div>
                <div style={{ position: 'absolute', top: '24px', left: '24px', border: '1px solid #38bdf8', padding: '12px', borderRadius: '8px', transform: 'rotate(-15deg)', opacity: 0.8 }}>
                  <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '18px', textAlign: 'center', lineHeight: 1.2 }}>Blu<br />October<br />Festival</h3>
                </div>
                <p style={{ position: 'absolute', bottom: '16px', left: '24px', fontSize: '10px', color: '#64748b', margin: 0 }}>T&C apply.</p>
              </div>

              {/* Offer 2 */}
              <div className="offer-card" style={{ background: '#0a0a0a', borderRadius: '16px', overflow: 'hidden', color: 'white', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ padding: '32px', flex: 1, zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>IndiGo BluChip</span>
                  </div>
                  <h3 style={{ fontSize: '22px', margin: '0 0 12px 0', lineHeight: 1.4, fontWeight: '600' }}>Earn 2x IndiGo Bluchips on every<br />Cab booking</h3>
                  <p style={{ fontSize: '16px', color: '#e2e8f0', marginBottom: '32px' }}>Reserve your ride for just ₹1*</p>
                  <button style={{ background: '#334155', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '24px', fontSize: '12px', cursor: 'pointer' }}>Limited-time offer</button>
                </div>
                <div style={{ position: 'absolute', bottom: '24px', right: '24px', border: '1px solid #38bdf8', padding: '12px', borderRadius: '8px', transform: 'rotate(15deg)', opacity: 0.8 }}>
                  <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '14px', textAlign: 'center', lineHeight: 1.2 }}>Blu<br />October<br />Festival</h3>
                </div>
              </div>

              {/* Offer 3 */}
              <div className="offer-card" style={{ background: '#0284c7', borderRadius: '16px', overflow: 'hidden', color: 'white', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ padding: '32px', flex: 1, zIndex: 1 }}>
                  <h3 style={{ fontSize: '28px', margin: '0 0 8px 0', fontWeight: '800' }}>Hotels on IndiGo</h3>
                  <p style={{ fontSize: '15px', margin: '0 0 24px 0', opacity: 0.9, lineHeight: 1.4 }}>Earn IndiGo BluChips on hotels and<br />redeem for flights.</p>

                  <div style={{ display: 'flex', gap: '8px', fontSize: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
                    <span style={{ border: '1px dashed rgba(255,255,255,0.6)', padding: '6px 10px', borderRadius: '4px' }}><i className="fa-solid fa-bed"></i> 7 lakh+ hotels</span>
                    <span style={{ border: '1px dashed rgba(255,255,255,0.6)', padding: '6px 10px', borderRadius: '4px' }}><i className="fa-regular fa-calendar-check"></i> Free cancellation</span>
                  </div>

                  <button style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '8px 16px', borderRadius: '24px', fontSize: '12px', cursor: 'pointer' }}>Book now on goIndiGo.in</button>
                </div>

                {/* Decorative background image simulation */}
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: '50%', background: 'linear-gradient(to top, rgba(14,165,233,1) 0%, rgba(14,165,233,0) 100%)', zIndex: 0 }}></div>
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }

  const category = getCategory(selectedVehicleType);

  return (
    <section className={`tab-screen ${globalActiveTab === 'booking' ? 'active' : ''}`} id="tab-booking">

      {/* Global Booking Details Modal */}
      {selectedGlobalBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '800px', background: 'white', borderRadius: '16px', display: 'flex', overflow: 'hidden', maxHeight: '90vh' }}>

            {/* Left: Details */}
            <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#0f172a' }}>{selectedGlobalBooking.title}</h2>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Booking ID: {selectedGlobalBooking.bookingId}</div>
                </div>
                <button onClick={() => setSelectedGlobalBooking(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>FROM</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>{selectedGlobalBooking.source}</div>
                    <div style={{ fontSize: '13px', color: '#0f172a' }}>{selectedGlobalBooking.sourceTime}, {selectedGlobalBooking.sourceDate}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>TO</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>{selectedGlobalBooking.destination}</div>
                    <div style={{ fontSize: '13px', color: '#0f172a' }}>{selectedGlobalBooking.destinationTime}, {selectedGlobalBooking.destinationDate}</div>
                  </div>
                </div>
                <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Passenger Name</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>John Doe</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Contact Number</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>+91 9876543210</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Email Address</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>john.doe@example.com</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Address</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>123 Main St, Bangalore, India</div>
                  </div>
                </div>
              </div>

              {selectedGlobalBooking.isCancelled ? (
                <>
                  <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', color: '#ef4444' }}>Cancellation & Refund Details</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Base Fare Paid</span>
                    <span style={{ fontWeight: 'bold' }}>₹4,500</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Taxes & Fees Paid</span>
                    <span style={{ fontWeight: 'bold' }}>₹320</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Total Amount Paid</span>
                    <span style={{ fontWeight: 'bold' }}>₹4,720</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', marginTop: '16px' }}>
                    <span style={{ color: '#64748b' }}>Cancellation Penalty</span>
                    <span style={{ fontWeight: 'bold', color: '#ef4444' }}>-₹1,200</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>GST & Govt Taxes on Cancellation</span>
                    <span style={{ fontWeight: 'bold', color: '#ef4444' }}>-₹216</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Platform Convenience Fee (Non-refundable)</span>
                    <span style={{ fontWeight: 'bold', color: '#ef4444' }}>-₹100</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', marginBottom: '16px', marginTop: '16px' }}>
                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>Total Refund Amount</span>
                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>₹3,204</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                    <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}><i className="fa-solid fa-check-circle"></i> Refunded Successfully</span>
                    <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>Ref: RFND987654321</span>
                  </div>
                  <p suppressHydrationWarning style={{ fontSize: '12px', color: '#64748b', marginTop: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong>Note:</strong> The refund of ₹3,204 has been successfully processed and credited to the original payment method (Credit Card **** 1234) on {new Date().toLocaleDateString('en-IN')}. It may take 3-5 business days to reflect in your bank statement.
                  </p>
                </>
              ) : (
                <>
                  <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Transaction & Payment Details</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Base Fare</span>
                    <span style={{ fontWeight: 'bold' }}>₹4,500</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Taxes & Fees</span>
                    <span style={{ fontWeight: 'bold' }}>₹320</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Discount</span>
                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>-₹100</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', marginBottom: '16px' }}>
                    <span style={{ fontWeight: 'bold', color: '#0f172a' }}>Total Amount Paid</span>
                    <span style={{ fontWeight: 'bold', color: '#0f172a' }}>₹4,720</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                    <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>Paid via Credit Card **** 1234</span>
                    <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>Txn ID: TXN987654321</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {category === 'Road' && <RoadBooking selectedVehicleType={selectedVehicleType} handleBackToFleet={handleBackToFleet} />}
      {category === 'Sea' && <SeaBooking selectedVehicleType={selectedVehicleType} handleBackToFleet={handleBackToFleet} />}
      {category === 'Air' && <AirBooking selectedVehicleType={selectedVehicleType} handleBackToFleet={handleBackToFleet} />}
      {category === 'Train' && <TrainBooking selectedVehicleType={selectedVehicleType} handleBackToFleet={handleBackToFleet} />}
    </section>
  );
}
