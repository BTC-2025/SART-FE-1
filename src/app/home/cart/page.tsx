'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import UserSideBitTool from '@/components/UserSideBitTool';
import CitySelectorModal from '@/components/modals/CitySelectorModal';
import { useSartStore } from '@/store/useSartStore';
import { ALL_STORE_PRODUCTS } from '@/components/tabs/StoreTab';
import { DEFAULT_CART_ITEMS } from './defaultCartData';
import './CartPage.css';

export default function CartPage() {
  const {
    cart,
    wishlist,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
    clearWishlist,
    cleanExpiredCart,
    addToCart,
    wallet,
    updateBalance,
    addTransaction,
    isBitToolOpen
  } = useSartStore();

  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [activeBitToolPanel, setActiveBitToolPanel] = useState<string | null>(null);
  const [userSession, setUserSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'cart' | 'wishlist' | 'address' | 'payment' | 'order-success'>('cart');
  const [selectedAddress, setSelectedAddress] = useState<string>('addr_1');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    name: 'P. Vasanth Kumar',
    addressLine: 'East street, near lord Ganesh temple, Patur, Kovur, Sri Potti Sriramulu Nellore District, Sri Potti Sriramulu Nellore District, Andhra Pradesh, 524137',
    phone: '9032932985'
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [onlineAccordion, setOnlineAccordion] = useState<'upi' | 'wallet' | 'card' | 'netbanking'>('upi');
  const [isQrRevealed, setIsQrRevealed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [hasInitializedDefault, setHasInitializedDefault] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 2 columns x 2 rows = 4 items per page

  // Initialize default sample data if cart is empty on first visit
  useEffect(() => {
    if (!hasInitializedDefault && cart.length === 0) {
      const isCartSeeded = localStorage.getItem('sart_cart_seeded_v2');
      if (!isCartSeeded) {
        DEFAULT_CART_ITEMS.forEach((item) => {
          addToCart(item);
        });
        localStorage.setItem('sart_cart_seeded_v2', 'true');
      }
      setHasInitializedDefault(true);
    }
  }, [cart.length, hasInitializedDefault, addToCart]);

  // Listen for city selector modal event (e.g. from location button in Navbar)
  useEffect(() => {
    const handleOpenModal = (e: any) => {
      if (e.detail === 'modal-city-selector') {
        setIsCityModalOpen(true);
      }
    };
    window.addEventListener('openReactModal', handleOpenModal);
    return () => window.removeEventListener('openReactModal', handleOpenModal);
  }, []);

  // Check login and clean expired guest items
  useEffect(() => {
    cleanExpiredCart();

    const checkSession = () => {
      try {
        const stored = localStorage.getItem('sart_user_session');
        if (stored) {
          setUserSession(JSON.parse(stored));
        } else {
          setUserSession(null);
        }
      } catch (e) {
        setUserSession(null);
      }
    };

    checkSession();
    window.addEventListener('user-session-changed', checkSession);
    return () => window.removeEventListener('user-session-changed', checkSession);
  }, [cleanExpiredCart]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const isGuest = !userSession;

  // Pagination calculation for 2 columns x 2 rows (4 items per page)
  const totalPages = Math.ceil(cart.length / itemsPerPage);
  const activePage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedCartItems = cart.slice(startIndex, startIndex + itemsPerPage);

  // Subtotal & savings calculation
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalSubtotal = cart.reduce((sum, item) => {
    const orig = item.originalPrice || Math.round(item.price * 1.35);
    return sum + (orig * item.quantity);
  }, 0);
  const productDiscount = Math.max(0, originalSubtotal - subtotal);
  const couponDiscount = promoApplied ? Math.round(subtotal * 0.15) : 0;
  const deliveryFee = subtotal > 999 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);
  const totalSavings = productDiscount + couponDiscount;

  // Wishlist items populated with full details
  const wishlistItems = (wishlist || []).map((id) => {
    const product = ALL_STORE_PRODUCTS.find((p) => p.id === id);
    if (product) {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: (product as any).originalPrice || Math.round(product.price * 1.3),
        icon: product.icon || 'fa-box',
        image: (product as any).image,
        category: product.category,
        brand: (product as any).brand || 'SART Certified',
        rating: (product as any).rating || 4.8,
        inStock: (product as any).inStock ?? true,
      };
    }
    return {
      id,
      name: `Saved Item (${id})`,
      price: 999,
      originalPrice: 1499,
      icon: 'fa-heart',
      image: undefined,
      category: 'Saved Wishlist',
      brand: 'SART Mobility',
      rating: 4.7,
      inStock: true,
    };
  });

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a coupon code.');
      return;
    }
    if (code === 'SART15' || code === 'FIRSTDRIVE' || code === 'SAVE15') {
      setPromoApplied(true);
      showToast('Coupon applied! 15% extra discount has been deducted.');
    } else {
      setPromoError('Invalid coupon. Try using "SART15" for 15% off.');
    }
  };

  const handleRemoveCoupon = () => {
    setPromoApplied(false);
    setPromoCode('');
    showToast('Promo code removed.');
  };

  const handleResetToDefaults = () => {
    clearCart();
    DEFAULT_CART_ITEMS.forEach((item) => addToCart(item));
    showToast('Cart reloaded with default featured products.');
  };

  // Calculate Online Payment Discount (Matching reference: extra discount for Pay Online)
  const onlineDiscount = paymentMethod === 'online' ? Math.min(86, Math.max(20, Math.round(finalTotal * 0.05))) : 0;
  const paymentFinalTotal = Math.max(0, finalTotal - onlineDiscount);

  const handleProceedToAddress = () => {
    if (cart.length === 0) {
      showToast('Cart is empty!');
      return;
    }
    setActiveTab('address');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToPayment = () => {
    setActiveTab('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmOrder = () => {
    if (cart.length === 0) {
      showToast('Cart is empty!');
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      if (paymentMethod === 'online' && onlineAccordion === 'wallet') {
        if (wallet.balance < paymentFinalTotal) {
          showToast(`Insufficient Wallet Balance! Need ₹${paymentFinalTotal.toLocaleString('en-IN')}`);
          return;
        }
        updateBalance(paymentFinalTotal, false);
      }

      addTransaction({
        id: `tx-${Date.now()}`,
        title: `Order: ${totalItemsCount} item(s) (${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'})`,
        amount: paymentFinalTotal,
        date: new Date().toLocaleString(),
        isCredit: false,
        category: 'Store'
      });

      clearCart();
      setActiveTab('order-success');
      showToast('Order placed successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  const handleMoveToWishlist = (item: any) => {
    removeFromCart(item.id);
    if (!wishlist.includes(item.id)) {
      toggleWishlist(item.id);
    }
    showToast(`Saved "${item.name}" to Wishlist.`);
  };

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      icon: item.icon || 'fa-box',
      image: item.image,
      category: item.category || 'General',
      brand: item.brand,
      quantity: 1,
      rating: item.rating,
      inStock: item.inStock ?? true,
      deliveryEstimate: 'Delivered in 2-3 Days',
      savedAt: Date.now()
    });
    toggleWishlist(item.id);
    showToast(`Added "${item.name}" to your cart.`);
  };

  return (
    <div className="web-app-layout">
      <Navbar />
      <SubNavbar />
      <UserSideBitTool
        isOpen={isBitToolOpen}
        onActivePanelChange={(panel) => setActiveBitToolPanel(panel)}
      />

      <main className={`cart-page-main ${isBitToolOpen ? (activeBitToolPanel ? 'has-bittool-panel' : 'has-bittool-strip') : ''}`}>
        {/* Toast Alert */}
        {toastMsg && (
          <div className="cart-page-toast">
            <i className="fa-solid fa-circle-check"></i>
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="cart-page-container">
          {/* Checkout Process Stepper Header (Image 4) */}
          {(activeTab === 'cart' || activeTab === 'address' || activeTab === 'payment' || activeTab === 'order-success') && (
            <div className="checkout-stepper-container">
              <div
                className={`step-item ${activeTab === 'cart' ? 'current' : 'completed'}`}
                onClick={() => setActiveTab('cart')}
              >
                <div className="step-circle">
                  {activeTab !== 'cart' ? <i className="fa-solid fa-check"></i> : <span>1</span>}
                </div>
                <span className="step-label">Cart</span>
              </div>
              <div className={`step-connector ${activeTab !== 'cart' ? 'active' : ''}`}></div>

              <div
                className={`step-item ${activeTab === 'address' ? 'current' : (activeTab === 'payment' || activeTab === 'order-success') ? 'completed' : 'pending'}`}
                onClick={() => {
                  if (cart.length > 0) setActiveTab('address');
                }}
              >
                <div className="step-circle">
                  {(activeTab === 'payment' || activeTab === 'order-success') ? (
                    <i className="fa-solid fa-check"></i>
                  ) : (
                    <span>2</span>
                  )}
                </div>
                <span className="step-label">Address</span>
              </div>
              <div className={`step-connector ${(activeTab === 'payment' || activeTab === 'order-success') ? 'active' : ''}`}></div>

              <div
                className={`step-item ${activeTab === 'payment' ? 'current' : activeTab === 'order-success' ? 'completed' : 'pending'}`}
                onClick={() => {
                  if (cart.length > 0) setActiveTab('payment');
                }}
              >
                <div className="step-circle">
                  {activeTab === 'order-success' ? <i className="fa-solid fa-check"></i> : <span>3</span>}
                </div>
                <span className="step-label">Payment</span>
              </div>
              <div className={`step-connector ${activeTab === 'order-success' ? 'active' : ''}`}></div>

              <div className={`step-item ${activeTab === 'order-success' ? 'completed' : 'pending'}`}>
                <div className="step-circle">
                  <span>4</span>
                </div>
                <span className="step-label">Summary</span>
              </div>
            </div>
          )}

          {/* Top Modern Header */}
          <div className="cart-modern-hero">
            <div className="cart-hero-left">
              <h1 className="cart-page-title">
                {activeTab === 'cart' && 'Shopping Cart'}
                {activeTab === 'address' && 'Select Delivery Address'}
                {activeTab === 'payment' && 'Select Payment Method'}
                {activeTab === 'order-success' && 'Order Confirmed'}
                {activeTab === 'wishlist' && 'Saved Products'}
              </h1>
            </div>
          </div>

          {/* VIEW 1: SHOPPING CART */}
          {activeTab === 'cart' && (
            <div className="cart-layout-grid">
              {/* Left Column: Cart Items List */}
              <div className="cart-items-section">
                <div className="cart-section-top">
                  <div className="cart-count-group">
                    <span className="cart-items-count">
                      {totalItemsCount} {totalItemsCount === 1 ? 'Unit' : 'Units'} ({cart.length} unique {cart.length === 1 ? 'item' : 'items'})
                    </span>
                    {totalSavings > 0 && (
                      <span className="cart-savings-pill">
                        <i className="fa-solid fa-tag"></i> Saving ₹{totalSavings.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="cart-top-actions">
                    <button
                      type="button"
                      className="cart-reload-defaults-btn"
                      onClick={handleResetToDefaults}
                      title="Load default sample items"
                    >
                      <i className="fa-solid fa-rotate"></i> Load Default Items
                    </button>
                    {cart.length > 0 && (
                      <button
                        type="button"
                        className="cart-clear-all-btn"
                        onClick={() => {
                          if (confirm('Are you sure you want to remove all items from your cart?')) {
                            clearCart();
                            showToast('Cart cleared successfully.');
                          }
                        }}
                      >
                        <i className="fa-solid fa-trash-can"></i> Clear Cart
                      </button>
                    )}
                  </div>
                </div>

                {cart.length === 0 ? (
                  <div className="cart-empty-state">
                    <div className="cart-empty-icon">
                      <i className="fa-solid fa-cart-shopping"></i>
                    </div>
                    <h3>Your shopping cart is currently empty</h3>
                    <p>Load our default verified products to explore full product specs, pricing, and checkout, or browse the store.</p>
                    <div className="cart-empty-actions">
                      <button
                        type="button"
                        className="btn-primary-explore"
                        onClick={handleResetToDefaults}
                      >
                        <i className="fa-solid fa-plus-circle"></i> Load Default Products
                      </button>
                      <button
                        type="button"
                        className="btn-secondary-explore"
                        onClick={() => window.location.href = '/store'}
                      >
                        <i className="fa-solid fa-store"></i> Explore SART Store
                      </button>
                      <button
                        type="button"
                        className="btn-secondary-explore"
                        onClick={() => setActiveTab('wishlist')}
                      >
                        <i className="fa-solid fa-heart"></i> View Saved Items ({wishlistItems.length})
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="cart-items-list">
                      {paginatedCartItems.map((item) => {
                        const itemTotal = item.price * item.quantity;
                        const origPrice = item.originalPrice || Math.round(item.price * 1.35);
                        const origTotal = origPrice * item.quantity;
                        const discountPercent = Math.round(((origPrice - item.price) / origPrice) * 100);
                        const deliveryDate = item.deliveryEstimate || 'Delivered in 2-3 Business Days';
                        const brandName = item.brand || 'SART Certified Automotive';

                        return (
                          <div key={item.id} className="cart-item-card-modern">
                            {/* Top row: Media + Details */}
                            <div className="cart-item-top-row">
                              {/* Left: Product Thumbnail */}
                              <div className="cart-item-media">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="cart-item-thumbnail"
                                    onError={(e) => {
                                      // Fallback to icon if remote image fails
                                      (e.target as HTMLElement).style.display = 'none';
                                      const fallback = (e.target as HTMLElement).parentElement?.querySelector('.cart-item-icon-fallback') as HTMLElement;
                                      if (fallback) fallback.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div className="cart-item-icon-fallback" style={{ display: item.image ? 'none' : 'flex' }}>
                                  <i className={`fa-solid ${item.icon || 'fa-box'}`}></i>
                                </div>
                                {item.badge && (
                                  <span className="cart-item-floating-badge">{item.badge}</span>
                                )}
                              </div>

                              {/* Middle: Rich Product Specs & Details */}
                              <div className="cart-item-details">
                                <div className="cart-item-brand-row">
                                  <span className="cart-item-brand">{brandName}</span>
                                  <span className="cart-item-cat-tag">{item.category || 'Automotive Spares'}</span>
                                </div>

                                <h3 className="cart-item-title">{item.name}</h3>

                                {item.description && (
                                  <p className="cart-item-desc">{item.description}</p>
                                )}

                                {/* Trust badges and product metadata */}
                                <div className="cart-item-features-strip">
                                  <div className="cart-feature-chip rating">
                                    <i className="fa-solid fa-star"></i>
                                    <span>{item.rating || 4.8}</span>
                                    <small>({item.reviewsCount || 120})</small>
                                  </div>
                                  <div className="cart-feature-chip verified">
                                    <i className="fa-solid fa-certificate"></i>
                                    <span>1 Year Brand Warranty</span>
                                  </div>
                                  <div className="cart-feature-chip stock">
                                    <i className="fa-solid fa-check-circle"></i>
                                    <span>In Stock & Ready to Ship</span>
                                  </div>
                                </div>

                                {/* Delivery & Protection row */}
                                <div className="cart-item-delivery-row">
                                  <div className="delivery-info">
                                    <i className="fa-solid fa-truck-fast"></i>
                                    <span>Fast Delivery: <strong>{deliveryDate}</strong></span>
                                  </div>
                                  <div className="return-info">
                                    <i className="fa-solid fa-rotate-left"></i>
                                    <span>7 Days Free Return / Replacement</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Bar: Action buttons on left, pricing + stepper on right */}
                            <div className="cart-item-bottom-bar">
                              <div className="cart-item-bottom-actions">
                                <button
                                  type="button"
                                  className="btn-modern-action wishlist"
                                  onClick={() => handleMoveToWishlist(item)}
                                >
                                  <i className="fa-regular fa-heart"></i> Save for Later
                                </button>
                                <span className="action-sep">•</span>
                                <button
                                  type="button"
                                  className="btn-modern-action remove"
                                  onClick={() => {
                                    removeFromCart(item.id);
                                    showToast(`Removed "${item.name}" from cart.`);
                                  }}
                                >
                                  <i className="fa-solid fa-trash-can"></i> Remove
                                </button>
                              </div>

                              <div className="cart-item-pricing-col">
                                <div className="pricing-box">
                                  <div className="current-price-row">
                                    <span className="cart-final-price">₹{itemTotal.toLocaleString('en-IN')}</span>
                                  </div>
                                  {origTotal > itemTotal && (
                                    <div className="orig-price-row">
                                      <span className="cart-original-price">₹{origTotal.toLocaleString('en-IN')}</span>
                                      <span className="cart-discount-percent">{discountPercent}% OFF</span>
                                    </div>
                                  )}
                                  <span className="cart-unit-rate">₹{item.price.toLocaleString('en-IN')} per unit</span>
                                </div>

                                {/* Interactive Quantity Stepper */}
                                <div className="modern-qty-stepper">
                                  <span className="stepper-label">Quantity</span>
                                  <div className="stepper-controls">
                                    <button
                                      type="button"
                                      className="stepper-btn minus"
                                      onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                                      disabled={item.quantity <= 1}
                                      title="Decrease quantity"
                                    >
                                      <i className="fa-solid fa-minus"></i>
                                    </button>
                                    <span className="stepper-number">{item.quantity}</span>
                                    <button
                                      type="button"
                                      className="stepper-btn plus"
                                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                      title="Increase quantity"
                                    >
                                      <i className="fa-solid fa-plus"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Clean Pagination Control matching user image */}
                    {totalPages > 1 && (
                      <div className="cart-pagination-bar">
                        <button
                          type="button"
                          className={`cart-page-nav-btn ${activePage <= 1 ? 'disabled' : ''}`}
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={activePage <= 1}
                          title="Previous Page"
                        >
                          <i className="fa-solid fa-chevron-left"></i>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            className={`cart-page-number-btn ${activePage === pageNum ? 'active' : ''}`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        ))}

                        <button
                          type="button"
                          className={`cart-page-nav-btn ${activePage >= totalPages ? 'disabled' : ''}`}
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={activePage >= totalPages}
                          title="Next Page"
                        >
                          <i className="fa-solid fa-chevron-right"></i>
                        </button>
                      </div>
                    )}
                  </>
                )}


              </div>

              {/* Right Column: Order Summary & Checkout Card */}
              {cart.length > 0 && (
                <div className="cart-summary-section">
                  <div className="cart-summary-card-modern">
                    <h3 className="summary-card-title">
                      <i className="fa-solid fa-receipt"></i> Order Summary
                    </h3>

                    {/* Promo Code Input */}
                    <div className="coupon-box">
                      <label className="coupon-label">Apply Promo / Coupon Code</label>
                      {!promoApplied ? (
                        <form onSubmit={handleApplyCoupon} className="coupon-form">
                          <input
                            type="text"
                            placeholder="Enter Code (e.g. SART15)"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="coupon-input"
                          />
                          <button type="submit" className="coupon-apply-btn">
                            Apply
                          </button>
                        </form>
                      ) : (
                        <div className="coupon-applied-pill">
                          <div className="coupon-applied-text">
                            <i className="fa-solid fa-circle-check"></i>
                            <span>Code <strong>{promoCode || 'SART15'}</strong> Applied!</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="coupon-remove-btn"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      {promoError && <p className="coupon-error-text">{promoError}</p>}
                    </div>

                    {/* Breakdown List */}
                    <div className="summary-breakdown">
                      <div className="breakdown-row">
                        <span>Items Price ({totalItemsCount} units)</span>
                        <span>₹{originalSubtotal.toLocaleString('en-IN')}</span>
                      </div>

                      {productDiscount > 0 && (
                        <div className="breakdown-row discount">
                          <span>Catalog Discount</span>
                          <span>-₹{productDiscount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {promoApplied && (
                        <div className="breakdown-row discount promo">
                          <span>Promo Code Savings (15%)</span>
                          <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      <div className="breakdown-row">
                        <span>Estimated Delivery</span>
                        {deliveryFee === 0 ? (
                          <span className="free-delivery-badge">FREE</span>
                        ) : (
                          <span>₹{deliveryFee}</span>
                        )}
                      </div>

                      <div className="breakdown-row">
                        <span>Estimated Taxes & Packaging</span>
                        <span className="free-delivery-badge">INCLUDED</span>
                      </div>

                      <div className="summary-line-divider"></div>

                      <div className="breakdown-row final-total-row">
                        <div>
                          <strong>Total Payable</strong>
                          <span className="tax-inclusive-tag">(Inclusive of all GST)</span>
                        </div>
                        <strong className="final-total-num">₹{finalTotal.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    {totalSavings > 0 && (
                      <div className="summary-savings-banner">
                        <i className="fa-solid fa-gift"></i>
                        <span>You are saving <strong>₹{totalSavings.toLocaleString('en-IN')}</strong> on this order!</span>
                      </div>
                    )}

                    {/* SART Wallet Box */}
                    <div className="wallet-card-highlight">
                      <div className="wallet-card-header">
                        <div className="wallet-icon-ring">
                          <i className="fa-solid fa-wallet"></i>
                        </div>
                        <div className="wallet-balance-info">
                          <span className="wallet-title">SART Wallet Balance</span>
                          <strong className="wallet-amount">₹{wallet.balance.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                      {wallet.balance < finalTotal ? (
                        <div className="wallet-alert-warning">
                          <i className="fa-solid fa-triangle-exclamation"></i>
                          <span>Low balance. Please top up or pay remaining at checkout.</span>
                        </div>
                      ) : (
                        <div className="wallet-alert-success">
                          <i className="fa-solid fa-circle-check"></i>
                          <span>Sufficient balance available for instant 1-click checkout.</span>
                        </div>
                      )}
                    </div>

                    {/* Primary Checkout Button to Proceed to Address & Payment */}
                    <button
                      type="button"
                      className="btn-checkout-modern"
                      onClick={handleProceedToAddress}
                    >
                      <i className="fa-solid fa-arrow-right"></i>
                      <span>Proceed to Buy (₹{finalTotal.toLocaleString('en-IN')})</span>
                    </button>

                    <div className="summary-guarantee-note">
                      <i className="fa-solid fa-shield-check"></i>
                      <span>Encrypted 256-bit Secure Checkout • 100% Buyer Protection</span>
                    </div>

                    {/* View Saved / Wishlist Products Entry Card */}
                    <button
                      type="button"
                      className="cart-saved-products-entry-btn"
                      onClick={() => setActiveTab('wishlist')}
                      title="View all saved products in Wishlist"
                    >
                      <div className="saved-entry-left">
                        <div className="saved-entry-icon">
                          <i className="fa-solid fa-heart"></i>
                        </div>
                        <div className="saved-entry-info">
                          <span className="saved-entry-title">Saved Products</span>
                          <span className="saved-entry-count">
                            {wishlistItems.length} {wishlistItems.length === 1 ? 'item saved' : 'items saved'} for later
                          </span>
                        </div>
                      </div>
                      <div className="saved-entry-action">
                        <span>View</span>
                        <i className="fa-solid fa-chevron-right"></i>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: ADDRESS SELECTION (Image 1) */}
          {activeTab === 'address' && (
            <div className="checkout-stage-layout">
              {/* Left Column: Address Selection */}
              <div className="checkout-main-content">
                <div className="checkout-stage-card">
                  <div className="checkout-card-header-row">
                    <h2 className="checkout-stage-title">Select Delivery Address</h2>
                    <button
                      type="button"
                      className="checkout-add-action-btn"
                      onClick={() => setIsAddingAddress(true)}
                    >
                      + ADD NEW ADDRESS
                    </button>
                  </div>

                  {/* Selected Address Card */}
                  <div className={`checkout-address-box ${selectedAddress === 'addr_1' ? 'selected' : ''}`}>
                    <div className="address-box-top">
                      <div className="address-radio-label">
                        <span className="address-custom-radio checked"></span>
                        <h3 className="address-user-name">{addressDetails.name}</h3>
                      </div>
                      <button
                        type="button"
                        className="address-edit-btn"
                        onClick={() => setIsEditingAddress(true)}
                      >
                        EDIT
                      </button>
                    </div>

                    <p className="address-text-body">
                      {addressDetails.addressLine}
                    </p>

                    <p className="address-phone-number">
                      {addressDetails.phone}
                    </p>

                    <button
                      type="button"
                      className="btn-deliver-address-action"
                      onClick={handleProceedToPayment}
                    >
                      Deliver to this Address
                    </button>
                  </div>

                  {/* Modal / Form for editing address if triggered */}
                  {isEditingAddress && (
                    <div className="address-edit-inline-form">
                      <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 800 }}>Edit Delivery Address</h4>
                      <input
                        type="text"
                        className="checkout-input"
                        placeholder="Full Name"
                        value={addressDetails.name}
                        onChange={(e) => setAddressDetails({ ...addressDetails, name: e.target.value })}
                        style={{ marginBottom: '8px' }}
                      />
                      <textarea
                        className="checkout-textarea"
                        placeholder="Complete Address"
                        value={addressDetails.addressLine}
                        onChange={(e) => setAddressDetails({ ...addressDetails, addressLine: e.target.value })}
                        style={{ marginBottom: '8px' }}
                      />
                      <input
                        type="text"
                        className="checkout-input"
                        placeholder="Mobile Number"
                        value={addressDetails.phone}
                        onChange={(e) => setAddressDetails({ ...addressDetails, phone: e.target.value })}
                        style={{ marginBottom: '10px' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn-deliver-address-action"
                          style={{ width: 'auto', padding: '6px 16px' }}
                          onClick={() => {
                            setIsEditingAddress(false);
                            showToast('Address updated.');
                          }}
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          className="btn-back-to-cart"
                          onClick={() => setIsEditingAddress(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Price Details (Matching Image 1 & 2 & 3) */}
              <div className="checkout-side-summary">
                <div className="price-details-card">
                  <h3 className="price-details-title">Price Details ({totalItemsCount} Items)</h3>

                  <div className="price-details-list">
                    <div className="price-row">
                      <span>Product Price</span>
                      <span className="price-val">+ ₹{originalSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-row discount">
                      <span>Total Discounts</span>
                      <span className="price-val discount-green">- ₹{totalSavings.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="price-details-divider"></div>

                    <div className="price-row order-total-row">
                      <strong>Order Total</strong>
                      <strong className="order-total-amount">₹{finalTotal.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {totalSavings > 0 && (
                    <div className="yay-savings-badge">
                      <div className="yay-icon">
                        <i className="fa-solid fa-percent"></i>
                      </div>
                      <span>Yay! Your total discount is ₹{totalSavings.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: PAYMENT METHOD (Image 2 & 3) */}
          {activeTab === 'payment' && (
            <div className="checkout-stage-layout">
              {/* Left Column: Select Payment Method */}
              <div className="checkout-main-content">
                <div className="checkout-stage-card">
                  <div className="checkout-card-header-row">
                    <h2 className="checkout-stage-title">Select Payment Method</h2>
                  </div>

                  <div className="payment-options-container">
                    {/* Option 1: Cash on Delivery */}
                    <div
                      className={`payment-method-box ${paymentMethod === 'cod' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className="pm-header-row">
                        <div className="pm-left">
                          <span className="pm-price">₹{finalTotal.toLocaleString('en-IN')}</span>
                          <span className="pm-label">Cash on Delivery</span>
                          <span className="pm-cash-icon" role="img" aria-label="cash">💵</span>
                        </div>
                        <div className="pm-radio-indicator">
                          {paymentMethod === 'cod' && <i className="fa-solid fa-check"></i>}
                        </div>
                      </div>
                    </div>

                    {/* Option 2: Pay Online with Sub-methods */}
                    <div className={`payment-method-box pay-online-box ${paymentMethod === 'online' ? 'selected' : ''}`}>
                      <div className="pm-header-row" onClick={() => setPaymentMethod('online')}>
                        <div className="pm-left">
                          <div className="pm-price-wrap">
                            <span className="pm-price-strike">₹{finalTotal.toLocaleString('en-IN')}</span>
                            <span className="pm-price online-green">₹{paymentFinalTotal.toLocaleString('en-IN')}</span>
                            <span className="pm-save-pill">Save ₹{onlineDiscount || 86}</span>
                          </div>
                          <span className="pm-label">Pay Online</span>
                          <div className="pm-brand-icons">
                            <span className="gpay-circle">
                              <span style={{ color: '#4285F4', fontWeight: 900 }}>G</span>
                              <span style={{ color: '#EA4335', fontWeight: 900 }}>P</span>
                              <span style={{ color: '#FBBC05', fontWeight: 900 }}>a</span>
                              <span style={{ color: '#34A853', fontWeight: 900 }}>y</span>
                            </span>
                          </div>
                        </div>
                        <div className="pm-radio-indicator">
                          {paymentMethod === 'online' && <i className="fa-solid fa-check"></i>}
                        </div>
                      </div>

                      {/* Promo tag */}
                      <div className="online-extra-discount-bar">
                        <div className="online-tag-icon">
                          <i className="fa-solid fa-percent"></i>
                        </div>
                        <span>Get extra ₹20 off with Google Pay</span>
                        <button type="button" className="view-offers-btn" onClick={() => showToast('Instant ₹20 applied for GPay / UPI payments!')}>
                          View Offers
                        </button>
                      </div>

                      {/* Expanded Accordion List for Online Payment (Image 3) */}
                      {paymentMethod === 'online' && (
                        <div className="online-accordion-list">
                          {/* Accordion: UPI */}
                          <div className="accordion-item">
                            <div
                              className="accordion-header"
                              onClick={() => setOnlineAccordion(onlineAccordion === 'upi' ? ('' as any) : 'upi')}
                            >
                              <span className="acc-title">UPI</span>
                              <i className={`fa-solid fa-chevron-${onlineAccordion === 'upi' ? 'up' : 'down'}`}></i>
                            </div>

                            {onlineAccordion === 'upi' && (
                              <div className="accordion-body">
                                <div className="upi-scan-qr-section">
                                  <div className="upi-scan-label">
                                    <i className="fa-solid fa-qrcode" style={{ fontSize: '15px' }}></i>
                                    <span>Scan and Pay</span>
                                  </div>

                                  <div className="upi-partner-badges">
                                    <span className="app-badge gpay">GPay</span>
                                    <span className="app-badge phonepe">PhonePe</span>
                                    <span className="app-badge paytm">Paytm</span>
                                    <span className="app-badge bhim">BHIM</span>
                                  </div>

                                  {/* QR Code Container */}
                                  <div className="upi-qr-card-frame">
                                    <div className="qr-bracket-corner top-left"></div>
                                    <div className="qr-bracket-corner top-right"></div>
                                    <div className="qr-bracket-corner bottom-left"></div>
                                    <div className="qr-bracket-corner bottom-right"></div>

                                    {!isQrRevealed ? (
                                      <div className="qr-blurred-view">
                                        <div className="qr-pixel-matrix-placeholder"></div>
                                        <button
                                          type="button"
                                          className="btn-view-qr-code"
                                          onClick={() => setIsQrRevealed(true)}
                                        >
                                          View QR Code
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="qr-revealed-view">
                                        <div className="qr-mock-code">
                                          <div className="qr-pixel corner tl"></div>
                                          <div className="qr-pixel corner tr"></div>
                                          <div className="qr-pixel corner bl"></div>
                                          <div className="qr-pixel center">
                                            <i className="fa-solid fa-indian-rupee-sign"></i>
                                          </div>
                                        </div>
                                        <span className="qr-timer-text">Scan with any UPI App • Expires in 04:59</span>
                                      </div>
                                    )}
                                  </div>

                                  <span className="upi-subtext">Click to view and scan QR Code with any UPI App</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Accordion: Wallet */}
                          <div className="accordion-item">
                            <div
                              className="accordion-header"
                              onClick={() => setOnlineAccordion(onlineAccordion === 'wallet' ? ('' as any) : 'wallet')}
                            >
                              <span className="acc-title">Wallet (SART Wallet: ₹{wallet.balance.toLocaleString('en-IN')})</span>
                              <i className={`fa-solid fa-chevron-${onlineAccordion === 'wallet' ? 'up' : 'down'}`}></i>
                            </div>
                            {onlineAccordion === 'wallet' && (
                              <div className="accordion-body">
                                <p style={{ margin: '0 0 8px', fontSize: '11.5px', color: '#475569' }}>
                                  Use your pre-loaded SART Wallet balance for instant 1-tap checkout.
                                </p>
                                {wallet.balance < paymentFinalTotal ? (
                                  <span style={{ color: '#d97706', fontSize: '11px', fontWeight: 700 }}>
                                    ⚠️ Wallet balance is less than payable amount. Please select UPI or add funds.
                                  </span>
                                ) : (
                                  <span style={{ color: '#16a34a', fontSize: '11px', fontWeight: 700 }}>
                                    ✓ Sufficient balance available in SART Wallet.
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Accordion: Debit / Credit Cards */}
                          <div className="accordion-item">
                            <div
                              className="accordion-header"
                              onClick={() => setOnlineAccordion(onlineAccordion === 'card' ? ('' as any) : 'card')}
                            >
                              <span className="acc-title">Debit/Credit Cards</span>
                              <i className={`fa-solid fa-chevron-${onlineAccordion === 'card' ? 'up' : 'down'}`}></i>
                            </div>
                            {onlineAccordion === 'card' && (
                              <div className="accordion-body">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '340px' }}>
                                  <input type="text" className="checkout-input" placeholder="Card Number (XXXX XXXX XXXX XXXX)" maxLength={19} />
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <input type="text" className="checkout-input" placeholder="MM/YY" maxLength={5} />
                                    <input type="password" className="checkout-input" placeholder="CVV" maxLength={4} />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Accordion: Net Banking */}
                          <div className="accordion-item">
                            <div
                              className="accordion-header"
                              onClick={() => setOnlineAccordion(onlineAccordion === 'netbanking' ? ('' as any) : 'netbanking')}
                            >
                              <span className="acc-title">Net Banking</span>
                              <i className={`fa-solid fa-chevron-${onlineAccordion === 'netbanking' ? 'up' : 'down'}`}></i>
                            </div>
                            {onlineAccordion === 'netbanking' && (
                              <div className="accordion-body">
                                <select className="checkout-input">
                                  <option value="sbi">State Bank of India</option>
                                  <option value="hdfc">HDFC Bank</option>
                                  <option value="icici">ICICI Bank</option>
                                  <option value="axis">Axis Bank</option>
                                  <option value="kotak">Kotak Mahindra Bank</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Price Details & Continue CTA */}
              <div className="checkout-side-summary">
                <div className="price-details-card">
                  <h3 className="price-details-title">Price Details ({totalItemsCount} Items)</h3>

                  <div className="price-details-list">
                    <div className="price-row">
                      <span>Product Price</span>
                      <span className="price-val">+ ₹{originalSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-row discount">
                      <span>Total Discounts</span>
                      <span className="price-val discount-green">- ₹{(totalSavings + onlineDiscount).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="price-details-divider"></div>

                    <div className="price-row order-total-row">
                      <strong>Order Total</strong>
                      <strong className="order-total-amount">₹{paymentFinalTotal.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {totalSavings > 0 && (
                    <div className="yay-savings-badge">
                      <div className="yay-icon">
                        <i className="fa-solid fa-percent"></i>
                      </div>
                      <span>Yay! Your total discount is ₹{(totalSavings + onlineDiscount).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* Payment CTA Note & Button */}
                  <div className="payment-submit-container">
                    <p className="payment-cta-disclaimer">
                      {paymentMethod === 'online'
                        ? "Clicking on 'Continue' will proceed with secure payment"
                        : "Clicking on 'Continue' will not deduct any money"}
                    </p>
                    <button
                      type="button"
                      className="btn-payment-continue"
                      onClick={handleConfirmOrder}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <>
                          <i className="fa-solid fa-circle-notch fa-spin"></i>
                          <span>Processing Order...</span>
                        </>
                      ) : (
                        <span>Continue</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: ORDER SUCCESS */}
          {activeTab === 'order-success' && (
            <div className="order-success-screen">
              <div className="success-icon-banner">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <h2 className="success-headline">Order Placed Successfully!</h2>
              <p className="success-subtext">
                Thank you for your purchase, {addressDetails.name}! Your order has been registered and is being prepared for express delivery.
              </p>

              <div className="success-info-card">
                <div className="success-info-row">
                  <span>Payment Mode:</span>
                  <strong>{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (Prepaid)'}</strong>
                </div>
                <div className="success-info-row">
                  <span>Shipping To:</span>
                  <span>{addressDetails.addressLine}</span>
                </div>
                <div className="success-info-row">
                  <span>Contact Number:</span>
                  <strong>{addressDetails.phone}</strong>
                </div>
              </div>

              <div className="success-actions-row">
                <button
                  type="button"
                  className="btn-deliver-address-action"
                  style={{ width: 'auto', padding: '10px 24px' }}
                  onClick={() => {
                    setActiveTab('cart');
                    handleResetToDefaults();
                  }}
                >
                  <i className="fa-solid fa-rotate-left"></i> Order More Items
                </button>
                <button
                  type="button"
                  className="btn-back-to-cart"
                  style={{ padding: '10px 20px' }}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/store';
                    }
                  }}
                >
                  <i className="fa-solid fa-store"></i> Explore Store
                </button>
              </div>
            </div>
          )}

          {/* VIEW 5: WISHLIST (SAVED ITEMS) */}
          {activeTab === 'wishlist' && (
            <div className="wishlist-section">
              <div className="cart-section-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    className="btn-back-to-cart"
                    onClick={() => setActiveTab('cart')}
                    title="Return to Shopping Cart"
                  >
                    <i className="fa-solid fa-arrow-left"></i> Back to Cart
                  </button>
                  <span className="cart-items-count">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} saved in Wishlist
                  </span>
                </div>
                {wishlistItems.length > 0 && (
                  <button
                    type="button"
                    className="cart-clear-all-btn"
                    onClick={() => {
                      if (confirm('Are you sure you want to clear your entire wishlist?')) {
                        clearWishlist();
                        showToast('Wishlist cleared.');
                      }
                    }}
                  >
                    <i className="fa-solid fa-trash-can"></i> Remove All
                  </button>
                )}
              </div>

              {wishlistItems.length === 0 ? (
                <div className="cart-empty-state">
                  <div className="cart-empty-icon heart">
                    <i className="fa-solid fa-heart"></i>
                  </div>
                  <h3>Your Wishlist is Empty</h3>
                  <p>Save items you like by clicking the heart icon on any automotive part or accessory.</p>
                  <button
                    type="button"
                    className="btn-primary-explore"
                    onClick={() => window.location.href = '/store'}
                  >
                    <i className="fa-solid fa-store"></i> Browse SART Store
                  </button>
                </div>
              ) : (
                <div className="wishlist-grid">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="wishlist-card">
                      <button
                        type="button"
                        className="wishlist-remove-icon-btn"
                        onClick={() => {
                          toggleWishlist(item.id);
                          showToast(`Removed "${item.name}" from wishlist.`);
                        }}
                        title="Remove from wishlist"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>

                      <div className="wishlist-img-box">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        <i className={`fa-solid ${item.icon}`}></i>
                      </div>

                      <div className="wishlist-body">
                        <span className="wishlist-category">{item.category}</span>
                        <h4 className="wishlist-title">{item.name}</h4>
                        <div className="wishlist-pricing">
                          <span className="wishlist-price">₹{item.price.toLocaleString('en-IN')}</span>
                          {item.originalPrice && (
                            <span className="wishlist-original-price">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                      </div>

                      <div className="wishlist-footer">
                        <button
                          type="button"
                          className="btn-move-to-cart"
                          onClick={() => handleMoveToCart(item)}
                        >
                          <i className="fa-solid fa-bag-shopping"></i> Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CitySelectorModal isOpen={isCityModalOpen} onClose={() => setIsCityModalOpen(false)} />
    </div>
  );
}
