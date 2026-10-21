import React from "react";
import usePos from "./logic";
import "./pos.css";


const PosPage = () => {
  const {
    // State
    cart,
    search,
    setSearch,
    activeCategory,
    paymentMethod,
    setPaymentMethod,
    cashReceived,
    setCashReceived,
    loading,
    categories,
    showPaymentModal,
    processing,
    paymentSuccess,
    showCardModal,
    cardDetails,
    
    // Computed
    filteredProducts,
    subtotal,
    discount,
    tax,
    total,
    change,
    
    // Actions
    handleCategoryClick,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    handleCheckout,
    fmt,
    handleCardInputChange,
    closeCardModal,
    processCardPayment,
  } = usePos();

  return (
    <div className="pos-screen">
      {/* ── Main content ── */}
      <div className="pos-main-grid">
        {/* ─── Products panel ─── */}
        <div className="panel">
          <div className="panel-head">
            <h2>Products</h2>
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="pos-tabs">
            <button
              className={activeCategory === "All" ? "active" : ""}
              onClick={() => handleCategoryClick("All")}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.code}
                className={activeCategory !== "All" && activeCategory.code === cat.code ? "active" : ""}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat.desc}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflow: "auto", marginTop: 14 }}>
            {loading ? (
              <p className="pos-empty">Loading…</p>
            ) : filteredProducts.length === 0 ? (
              <p className="pos-empty">No products found</p>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((item) => (
                  <div
                    className="product-card"
                    key={item.prd_id}
                    onClick={() => addToCart(item)}
                  >
                    <div className="product-thumb">
                      {item.photo ? (
                        <img
                          src={`http://localhost:3000/${item.photo}`}
                          alt={item.prd_name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 10,
                          }}
                        />
                      ) : (
                        "📦"
                      )}
                    </div>
                    <h3>{item.prd_name || item.prd_id}</h3>
                    <div className="product-meta">
                      <strong>{fmt(item.unit_cost)}</strong>
                      <span>Qty: {item.qty ?? 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Cart panel ─── */}
        <div className="panel">
          <div className="panel-head middle-head">
            <div>
              <h2>Cart</h2>
              <p>{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
            </div>
            <button className="icon-clear" title="Clear cart" onClick={clearCart}>
              🗑
            </button>
          </div>

          <div className="cart-scroll">
            {cart.length === 0 ? (
              <p className="pos-empty">Cart is empty</p>
            ) : (
              cart.map((item) => (
                <div className="cart-item-card" key={item.prd_id}>
                  <div className="cart-item-left">
                    <div className="cart-avatar">📦</div>
                    <div>
                      <h4>{item.prd_name || item.prd_id}</h4>
                      <p>{fmt(item.unit_cost)} each</p>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <strong>{fmt(item.unit_cost * item.qty)}</strong>
                    <div className="qty-box">
                      <button onClick={() => updateQty(item.prd_id, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.prd_id, 1)}>+</button>
                    </div>
                    <button className="remove-x" onClick={() => removeItem(item.prd_id)}>
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

         
        </div>

        {/* ─── Payment panel ─── */}
        <div className="panel payment-panel">
          <h2>Payment</h2>

          <div className="amount-list">
            <div>
              <span>Subtotal</span>
              <strong>{fmt(subtotal)}</strong>
            </div>
            <div>
              <span>Discount</span>
              <strong>−{fmt(discount)}</strong>
            </div>
            <div>
              <span>Tax</span>
              <strong>{fmt(tax)}</strong>
            </div>
          </div>

          <div className="total-row">
            <span>Total</span>
            <strong>{fmt(total)}</strong>
          </div>

          <div className="payment-methods">
            <button
              className={paymentMethod === "cash" ? "active" : ""}
              onClick={() => setPaymentMethod("cash")}
            >
              <span>💵</span> Cash
            </button>
            <button
              className={paymentMethod === "card" ? "active" : ""}
              onClick={() => setPaymentMethod("card")}
            >
              <span>💳</span> Card
            </button>
            <button
              className={paymentMethod === "qr" ? "active" : ""}
              onClick={() => setPaymentMethod("qr")}
            >
              <span>📱</span> QR Pay
            </button>
            <button
              className={paymentMethod === "transfer" ? "active" : ""}
              onClick={() => setPaymentMethod("transfer")}
            >
              <span>🏦</span> Transfer 
            </button>
          </div>

          {paymentMethod === "cash" && (
            <div className="cash-box">
              <label>Cash Received</label>
              <input
                type="number"
                placeholder="0.00"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
              />
              <div className="change-row">
                <span>Change</span>
                <strong>{fmt(change >= 0 ? change : 0)}</strong>
              </div>
            </div>
          )}

          <div className="customer-box">
            <div>
              <span>Customer</span>
              <strong>Walk-in Customer</strong>
            </div>
            <button>✏️</button>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout — {fmt(total)}
          </button>

         
        </div>
      </div>

      {/* ── Card Input Modal ── */}
      {showCardModal && (
        <div className="payment-modal-overlay" onClick={closeCardModal}>
          <div className="payment-modal card-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💳 Card Payment</h2>
              <button className="modal-close" onClick={closeCardModal}>
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="card-form">
                <div className="card-preview">
                  <div className="card-chip"></div>
                  <div className="card-number-display">
                    {cardDetails.cardNumber || "•••• •••• •••• ••••"}
                  </div>
                  <div className="card-bottom">
                    <div className="card-holder-display">
                      <span>Card Holder</span>
                      <strong>{cardDetails.cardHolder || "YOUR NAME"}</strong>
                    </div>
                    <div className="card-expiry-display">
                      <span>Expires</span>
                      <strong>{cardDetails.expiryDate || "MM/YY"}</strong>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    value={cardDetails.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim();
                      handleCardInputChange("cardNumber", value);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Card Holder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardDetails.cardHolder}
                    onChange={(e) => handleCardInputChange("cardHolder", e.target.value.toUpperCase())}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={cardDetails.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + "/" + value.slice(2);
                        }
                        handleCardInputChange("expiryDate", value);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength="4"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                </div>

                <div className="card-amount">
                  <span>Amount to charge</span>
                  <strong>{fmt(total)}</strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeCardModal}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={processCardPayment}>
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Payment Processing Modal ── */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            {paymentSuccess ? (
              <div className="payment-success">
                <div className="success-icon">✓</div>
                <h2>Payment Successful!</h2>
                <p>Thank you for your purchase</p>
                <p className="success-total">{fmt(total)}</p>
              </div>
            ) : processing ? (
              <div className="payment-processing">
                {/* QR Pay Method */}
                {paymentMethod === "qr" && (
                  <>
                    <div className="qr-code-container">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=payment:${total.toFixed(2)}`}
                        alt="QR Code"
                        className="qr-code-image"
                      />
                    </div>
                    <h2>Scan to Pay</h2>
                    <p>Scan QR code with your mobile banking app</p>
                    <div className="processing-details">
                      <div className="detail-row">
                        <span>Amount</span>
                        <strong>{fmt(total)}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Status</span>
                        <strong className="status-waiting">
                          <span className="pulse-dot"></span>
                          Waiting for payment...
                        </strong>
                      </div>
                    </div>
                  </>
                )}

                {/* Cash Method */}
                {paymentMethod === "cash" && (
                  <>
                    <div className="processing-spinner"></div>
                    <h2>Processing Cash Payment...</h2>
                    <p>Confirming payment</p>
                    <div className="processing-details">
                      <div className="detail-row">
                        <span>Amount</span>
                        <strong>{fmt(total)}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Received</span>
                        <strong>{fmt(parseFloat(cashReceived) || 0)}</strong>
                      </div>
                      <div className="detail-row change-highlight">
                        <span>Change</span>
                        <strong>{fmt(change >= 0 ? change : 0)}</strong>
                      </div>
                    </div>
                  </>
                )}

                {/* Transfer Method */}
                {paymentMethod === "transfer" && (
                  <>
                    <div className="bank-icon">🏦</div>
                    <h2>Bank Transfer</h2>
                    <p>Transfer to the following account</p>
                    <div className="transfer-details">
                      <div className="transfer-row">
                        <span>Bank Name</span>
                        <strong>ABA Bank</strong>
                      </div>
                      <div className="transfer-row">
                        <span>Account Name</span>
                        <strong>POS Store LLC</strong>
                      </div>
                      <div className="transfer-row account-number">
                        <span>Account Number</span>
                        <strong>001 234 567 890</strong>
                        <button className="copy-btn" onClick={() => navigator.clipboard.writeText('001234567890')}>
                          📋
                        </button>
                      </div>
                      <div className="transfer-row amount-row">
                        <span>Amount</span>
                        <strong>{fmt(total)}</strong>
                      </div>
                    </div>
                    <div className="processing-status">
                      <span className="pulse-dot"></span>
                      Waiting for transfer confirmation...
                    </div>
                  </>
                )}

                {/* Card Method */}
                {paymentMethod === "card" && (
                  <>
                    <div className="processing-spinner"></div>
                    <h2>Processing Card Payment...</h2>
                    <p>Please wait while we process your card</p>
                    <div className="processing-details">
                      <div className="detail-row">
                        <span>Amount</span>
                        <strong>{fmt(total)}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Method</span>
                        <strong>💳 Card</strong>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default PosPage; 