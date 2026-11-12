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
  const [activeTab, setActiveTab] = useState<'cart' | 'wishlist'>('cart');
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

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Cart is empty!');
      return;
    }
    if (wallet.balance < finalTotal) {
      showToast(`Insufficient Wallet Balance! Need ₹${finalTotal.toLocaleString('en-IN')}`);
      return;
    }

    updateBalance(finalTotal, false);
    addTransaction({
      id: `tx-${Date.now()}`,
      title: `Checkout: ${totalItemsCount} item(s)`,
      amount: finalTotal,
      date: new Date().toLocaleString(),
      isCredit: false,
      category: 'Store'
    });

    clearCart();
    showToast(`Order placed successfully! ₹${finalTotal.toLocaleString('en-IN')} paid via SART Wallet.`);
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
          {/* Top Modern Header */}
          <div className="cart-modern-hero">
            <div className="cart-hero-left">

              <h1 className="cart-page-title">
                Shopping Cart
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
                                    }}
                                  />
                                ) : null}
                                <div className="cart-item-icon-fallback">
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

                {/* Additional Value Banner below items */}
                <div className="cart-assurance-banner">
                  <div className="assurance-item">
                    <i className="fa-solid fa-truck-shield"></i>
                    <div>
                      <strong>Free & Safe Delivery</strong>
                      <p>Orders above ₹999 qualify for express shipping across India.</p>
                    </div>
                  </div>
                  <div className="assurance-item">
                    <i className="fa-solid fa-wrench"></i>
                    <div>
                      <strong>Optional Doorstep Fitment</strong>
                      <p>Book a certified mechanic to install parts directly at your doorstep.</p>
                    </div>
                  </div>
                  <div className="assurance-item">
                    <i className="fa-solid fa-credit-card"></i>
                    <div>
                      <strong>Multiple Payment Options</strong>
                      <p>SART Wallet, UPI, Cards, NetBanking, and Cash on Delivery.</p>
                    </div>
                  </div>
                </div>
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

                    {/* Primary Checkout Button */}
                    <button
                      type="button"
                      className="btn-checkout-modern"
                      onClick={handleCheckout}
                    >
                      <i className="fa-solid fa-lock"></i>
                      <span>Pay ₹{finalTotal.toLocaleString('en-IN')} & Place Order</span>
                    </button>

                    <div className="summary-guarantee-note">
                      <i className="fa-solid fa-shield-check"></i>
                      <span>Encrypted 256-bit Secure Checkout • 100% Buyer Protection</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: WISHLIST (SAVED ITEMS) */}
          {activeTab === 'wishlist' && (
            <div className="wishlist-section">
              <div className="cart-section-top">
                <span className="cart-items-count">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} saved in Wishlist
                </span>
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
