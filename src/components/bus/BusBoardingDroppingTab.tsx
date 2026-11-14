import React, { useState } from 'react';
import { CANCELLATION_POLICY_DATA, CANCELLATION_POLICY_ROWS } from './busData';

export interface BusBoardingDroppingTabProps {
  boardingSubTab: 'boarding_dropping' | 'live_tracking' | 'cancellation' | 'amenities' | 'travel_policy';
  setBoardingSubTab: (tab: any) => void;
  activeRouteData: any;
  selectedBoardingPoint: string;
  selectedDroppingPoint: string;
  activeBoardingPoints: any[];
  activeDroppingPoints: any[];
  setSelectedBoardingPoint: (name: string) => void;
  setSelectedDroppingPoint: (name: string) => void;
  setModalTopTab: (tab: any) => void;
}

export const BusBoardingDroppingTab: React.FC<BusBoardingDroppingTabProps> = ({
  boardingSubTab,
  setBoardingSubTab,
  activeRouteData,
  selectedBoardingPoint,
  selectedDroppingPoint,
  activeBoardingPoints,
  activeDroppingPoints,
  setSelectedBoardingPoint,
  setSelectedDroppingPoint,
  setModalTopTab
}) => {
  const [showAllBoardingPoints, setShowAllBoardingPoints] = useState<boolean>(false);
  const [showAllDroppingPoints, setShowAllDroppingPoints] = useState<boolean>(false);

  return (
              <div className="bb-modal-tab-content-panel bb-boarding-dropping-panel-img5">
                {/* 1. Subtabs Header Bar (Exact Image 5) */}
                <div className="bb-img5-subtabs-bar">
                  <button
                    type="button"
                    className={`bb-img5-subtab-btn ${boardingSubTab === 'boarding_dropping' ? 'active' : ''}`}
                    onClick={() => setBoardingSubTab('boarding_dropping')}
                  >
                    Boarding/Dropping Point
                  </button>
                  <button
                    type="button"
                    className={`bb-img5-subtab-btn ${boardingSubTab === 'cancellation' ? 'active' : ''}`}
                    onClick={() => setBoardingSubTab('cancellation')}
                  >
                    Cancellation Policy
                  </button>
                  <button
                    type="button"
                    className={`bb-img5-subtab-btn ${boardingSubTab === 'amenities' ? 'active' : ''}`}
                    onClick={() => setBoardingSubTab('amenities')}
                  >
                    Amenities
                  </button>
                  <button
                    type="button"
                    className={`bb-img5-subtab-btn ${boardingSubTab === 'travel_policy' ? 'active' : ''}`}
                    onClick={() => setBoardingSubTab('travel_policy')}
                  >
                    Travel Policy
                  </button>
                </div>

                {boardingSubTab === 'boarding_dropping' ? (
                  <div className="bb-img5-points-content-scroll">
                    {/* 2. Boarding Points Section (Exact Image 5) */}
                    <div className="bb-img5-section-block">
                      <h3 className="bb-img5-section-title">Boarding Points</h3>
                      <div className="bb-img5-timeline-list">
                        {(showAllBoardingPoints ? activeBoardingPoints : activeBoardingPoints.slice(0, 4)).map((bp, i, arr) => (
                          <div key={bp.id} className="bb-img5-timeline-row">
                            <div className="bb-img5-time-col">
                              <span className="bb-img5-time">{bp.time}</span>
                              <span className="bb-img5-date">{bp.date}</span>
                            </div>

                            <div className="bb-img5-node-col">
                              <label className="bb-img5-radio-wrap">
                                <input
                                  type="radio"
                                  name="boardingRadio"
                                  checked={selectedBoardingPoint === bp.name}
                                  onChange={() => setSelectedBoardingPoint(bp.name)}
                                />
                                <span className="bb-img5-radio-circle"></span>
                              </label>
                              {i < arr.length - 1 && <span className="bb-img5-track-line"></span>}
                            </div>

                            <div
                              className="bb-img5-info-col"
                              onClick={() => setSelectedBoardingPoint(bp.name)}
                            >
                              <div className="bb-img5-point-name">{bp.name}</div>
                              <div className="bb-img5-point-landmark">{bp.landmark}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="bb-img5-view-more-btn"
                        onClick={() => setShowAllBoardingPoints(!showAllBoardingPoints)}
                      >
                        {showAllBoardingPoints ? 'View fewer Boarding points' : 'View more Boarding points'}
                      </button>
                    </div>

                    {/* 3. Dropping Points Section (Exact Image 5) */}
                    <div className="bb-img5-section-block" style={{ marginTop: '28px' }}>
                      <h3 className="bb-img5-section-title">Dropping Points</h3>
                      <div className="bb-img5-timeline-list">
                        {(showAllDroppingPoints ? activeDroppingPoints : activeDroppingPoints.slice(0, 4)).map((dp, i, arr) => (
                          <div key={dp.id} className="bb-img5-timeline-row">
                            <div className="bb-img5-time-col">
                              <span className="bb-img5-time">{dp.time}</span>
                              <span className="bb-img5-date">{dp.date}</span>
                            </div>

                            <div className="bb-img5-node-col">
                              <label className="bb-img5-radio-wrap">
                                <input
                                  type="radio"
                                  name="droppingRadio"
                                  checked={selectedDroppingPoint === dp.name}
                                  onChange={() => setSelectedDroppingPoint(dp.name)}
                                />
                                <span className="bb-img5-radio-circle"></span>
                              </label>
                              {i < arr.length - 1 && <span className="bb-img5-track-line"></span>}
                            </div>

                            <div
                              className="bb-img5-info-col"
                              onClick={() => setSelectedDroppingPoint(dp.name)}
                            >
                              <div className="bb-img5-point-name">{dp.name}</div>
                              <div className="bb-img5-point-landmark">{dp.landmark}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="bb-img5-view-more-btn"
                        onClick={() => setShowAllDroppingPoints(!showAllDroppingPoints)}
                      >
                        {showAllDroppingPoints ? 'View fewer Dropping points' : 'View more Dropping points'}
                      </button>
                    </div>

                    {/* 4. Cancellation Policy Table (Exact Image 5 Bottom) */}
                    <div className="bb-img5-section-block" style={{ marginTop: '28px' }}>
                      <h3 className="bb-img5-section-title">Cancellation Policy</h3>
                      <div className="bb-img5-cancel-table-card">
                        <div className="bb-img5-table-header-row">
                          <span className="bb-img5-th-left">
                            <strong>Cancellation Time</strong><br />
                            <small className="bb-img5-sub-th">(Valid from trip start time)</small>
                          </span>
                          <span className="bb-img5-th-right">
                            <strong>Refund</strong><br />
                            <small className="bb-img5-sub-th">Amount Details</small>
                          </span>
                        </div>

                        {CANCELLATION_POLICY_DATA.map((row, idx) => (
                          <div key={idx} className="bb-img5-table-body-row">
                            <span className="bb-img5-td-time">{row.time}</span>
                            <span className="bb-img5-td-refund">{row.refund}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : boardingSubTab === 'cancellation' ? (
                  <div className="bb-img5-cancel-expanded-view bb-cancel-img-box">
                    <h3 className="bb-cancel-card-title">Cancellation policy</h3>
                    <div className="bb-cancel-card-table-wrap">
                      <table className="bb-exact-cancel-table">
                        <thead>
                          <tr>
                            <th style={{ width: '42%' }}>Time before travel</th>
                            <th style={{ width: '28%', textAlign: 'center' }}>Without free cancellation</th>
                            <th style={{ width: '30%', textAlign: 'center', background: '#f0fdf4' }}>With free cancellation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {CANCELLATION_POLICY_ROWS.map((row, rIdx) => (
                            <tr key={rIdx}>
                              <td className="bb-cancel-time-cell">{row.time}</td>
                              <td className="bb-cancel-without-cell">{row.withoutFree}</td>
                              <td className="bb-cancel-with-cell">
                                {row.withFree?.includes('100%') ? (
                                  <span className="bb-cancel-badge-green">
                                    <i className="fa-solid fa-circle-check"></i> 100% Refund
                                  </span>
                                ) : (
                                  <span className="bb-cancel-badge-zero">0% refund</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Add Free Cancellation Banner */}
                    <div className="bb-cancel-promo-pink-banner">
                      <div className="bb-cancel-shield-icon">
                        <i className="fa-solid fa-indian-rupee-sign"></i>
                      </div>
                      <span>
                        Add <strong style={{ color: '#dc2626' }}>Free Cancellation</strong> while booking to get a 100% refund on cancellation
                      </span>
                    </div>

                    <ul className="bb-cancel-disclaimers-list">
                      <li>* Cancellation charges are computed on a per seat basis. Above cancellation fare is calculated based on seat fare of ₹ 399</li>
                      <li>* Cancellation charges are calculated based on service start date + time at :14-10-2026 18:45</li>
                      <li>* Ticket cannot be cancelled after scheduled bus departure time from the first boarding point</li>
                      <li>* Note: Cancellation charges mentioned above are excluding GST</li>
                      <li>* For group bookings individual seats can be cancelled.</li>
                    </ul>
                  </div>
                ) : boardingSubTab === 'amenities' ? (
                  <div className="bb-img5-amenities-view">
                    <h3 className="bb-img5-section-title">Bus Amenities</h3>
                    <div className="bb-amenities-grid-pills">
                      <div className="bb-amenity-pill"><i className="fa-solid fa-bottle-water"></i> Water Bottle</div>
                      <div className="bb-amenity-pill"><i className="fa-solid fa-bolt"></i> Personal Charging Point</div>
                      <div className="bb-amenity-pill"><i className="fa-solid fa-snowflake"></i> Central Air Conditioning</div>
                      <div className="bb-amenity-pill"><i className="fa-solid fa-lightbulb"></i> Individual Reading Lights</div>
                      <div className="bb-amenity-pill"><i className="fa-solid fa-bed"></i> Clean Blankets & Pillows</div>
                      <div className="bb-amenity-pill"><i className="fa-solid fa-satellite-dish"></i> Live GPS Tracking</div>
                      <div className="bb-amenity-pill"><i className="fa-solid fa-shield-halved"></i> Emergency Exit & Fire Safety</div>
                    </div>
                  </div>
                ) : (
                  <div className="bb-img5-travel-policy-view">
                    <h3 className="bb-img5-section-title">Travel & Luggage Policy</h3>
                    <ul className="bb-policy-bullets">
                      <li>Please arrive at your boarding point at least 15 minutes prior to scheduled departure.</li>
                      <li>Maximum luggage allowance is 15 kg per passenger ticket.</li>
                      <li>Valid government photo ID is mandatory during boarding.</li>
                    </ul>
                  </div>
                )}

                {/* Footer Navigation Buttons */}
                <div className="bb-modal-footer-nav-row" style={{ marginTop: '20px' }}>
                  <button
                    type="button"
                    className="bb-nav-back-btn"
                    onClick={() => setModalTopTab('select_seats')}
                  >
                    ← Back to Seat Selection
                  </button>

                  <div className="bb-footer-right-buttons">
                    <button
                      type="button"
                      className="bb-nav-live-track-btn"
                      onClick={() => setModalTopTab('live_tracking')}
                    >
                      <i className="fa-solid fa-satellite-dish"></i> Live Track Route 🛰️
                    </button>
                    <button
                      type="button"
                      className="bb-confirm-book-btn"
                      onClick={() => setModalTopTab('passenger_info')}
                    >
                      Continue to Passenger Info →
                    </button>
                  </div>
                </div>
      </div>
  );
};