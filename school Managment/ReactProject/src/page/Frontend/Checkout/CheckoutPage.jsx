import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import request from "../../../utils/request";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart, getCartCount } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    paymentMethod: "card",
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const validateShipping = () => {
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"];
    return required.every((field) => shippingInfo[field].trim() !== "");
  };

  const validatePayment = () => {
    if (paymentInfo.paymentMethod === "card") {
      return (
        paymentInfo.cardNumber.replace(/\s/g, "").length >= 16 &&
        paymentInfo.cardName.trim() !== "" &&
        paymentInfo.expiry.length === 5 &&
        paymentInfo.cvv.length >= 3
      );
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;

    setIsProcessing(true);

    try {
      // Map payment method to backend status_payment
      const paymentMethodMap = {
        card: "ABA",
        paypal: "Aceleda",
        cod: "Wing",
      };

      // Prepare order items for API
      const orderItems = cartItems.map((item) => ({
        prd_id: item.id,
        qty: item.quantity,
        unit_price: parseFloat(item.price.replace("$", "")) || 0,
      }));

      // Prepare order data
      const orderData = {
        email: shippingInfo.email,
        fullname: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        adress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country}`,
        postalcode: parseInt(shippingInfo.zipCode) || 0,
        status_payment: paymentMethodMap[paymentInfo.paymentMethod] || "ABA",
        items: orderItems,
      };

      // Call backend API
      
      const response = await request("api/customer/order", "POST", orderData);

      if (response?.success) {
        setOrderId(response.data.order_id);
        setOrderComplete(true);
        clearCart();
      } else {
        alert(response?.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert(error?.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined text-8xl text-subtle-light dark:text-subtle-dark">shopping_cart</span>
        <h2 className="mt-4 text-xl font-bold text-text-light dark:text-text-dark">Your cart is empty</h2>
        <Link
          to="/index"
          className="mt-6 rounded-lg bg-accent px-6 py-3 font-bold text-white"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background-light px-4 dark:bg-background-dark">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
          </div>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Order Confirmed!</h1>
          <p className="mt-4 text-subtle-light dark:text-subtle-dark">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <div className="mt-6 rounded-lg bg-card-light p-4 dark:bg-card-dark">
            <p className="text-sm text-subtle-light dark:text-subtle-dark">Order ID</p>
            <p className="text-lg font-bold text-accent">{orderId}</p>
          </div>
          <p className="mt-4 text-sm text-subtle-light dark:text-subtle-dark">
            A confirmation email has been sent to {shippingInfo.email}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/index"
              className="flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-bold text-white"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-accent px-6 py-3 font-bold text-accent"
            >
              <span className="material-symbols-outlined">print</span>
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light font-display text-text-light dark:bg-background-dark dark:text-text-dark">
      {/* Header */}
      <header className="border-b border-border-light bg-background-light dark:border-border-dark dark:bg-background-dark">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/index" className="flex items-center gap-3 text-primary dark:text-white">
            <span className="material-symbols-outlined text-2xl">storefront</span>
            <h1 className="text-xl font-bold">Shopify</h1>
          </Link>
          <div className="flex items-center gap-2 text-sm text-subtle-light dark:text-subtle-dark">
            <span className="material-symbols-outlined text-green-500">lock</span>
            Secure Checkout
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-accent" : "text-subtle-light dark:text-subtle-dark"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-accent text-white" : "bg-border-light dark:bg-border-dark"}`}>
                {step > 1 ? <span className="material-symbols-outlined text-base">check</span> : "1"}
              </div>
              <span className="hidden font-medium sm:inline">Shipping</span>
            </div>
            <div className={`h-px w-12 ${step >= 2 ? "bg-accent" : "bg-border-light dark:bg-border-dark"}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-accent" : "text-subtle-light dark:text-subtle-dark"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-accent text-white" : "bg-border-light dark:bg-border-dark"}`}>
                2
              </div>
              <span className="hidden font-medium sm:inline">Payment</span>
            </div>
            <div className={`h-px w-12 ${step >= 3 ? "bg-accent" : "bg-border-light dark:bg-border-dark"}`} />
            <div className={`flex items-center gap-2 ${step >= 3 ? "text-accent" : "text-subtle-light dark:text-subtle-dark"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? "bg-accent text-white" : "bg-border-light dark:bg-border-dark"}`}>
                3
              </div>
              <span className="hidden font-medium sm:inline">Confirm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="rounded-xl bg-card-light p-6 dark:bg-card-dark">
                <h2 className="mb-6 text-xl font-bold">Shipping Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                      className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-border-dark dark:bg-background-dark"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                      className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-border-dark dark:bg-background-dark"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-border-dark dark:bg-background-dark"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-border-dark dark:bg-background-dark"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-border-dark dark:bg-background-dark"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-border-dark dark:bg-background-dark"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-border-dark dark:bg-background-dark"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                      className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-border-dark dark:bg-background-dark"
                      placeholder="10001"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Country</label>
                    <select
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-border-dark dark:bg-background-dark"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <Link
                    to="/index/cart"
                    className="flex items-center gap-2 text-accent hover:underline"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to Cart
                  </Link>
                  <button
                    onClick={handleContinueToPayment}
                    disabled={!validateShipping()}
                    className="flex items-center gap-2 rounded-lg bg-accent px-6 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue to Payment
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-xl bg-card-light p-6 dark:bg-card-dark">
                <h2 className="mb-6 text-xl font-bold">Payment Method</h2>

                {/* Payment Method Selection */}
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                  <button
                    onClick={() => setPaymentInfo((prev) => ({ ...prev, paymentMethod: "card" }))}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                      paymentInfo.paymentMethod === "card"
                        ? "border-accent bg-accent/10"
                        : "border-border-light hover:border-accent dark:border-border-dark"
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">credit_card</span>
                    <span className="text-sm font-medium">Credit Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentInfo((prev) => ({ ...prev, paymentMethod: "paypal" }))}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                      paymentInfo.paymentMethod === "paypal"
                        ? "border-accent bg-accent/10"
                        : "border-border-light hover:border-accent dark:border-border-dark"
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                    <span className="text-sm font-medium">PayPal</span>
                  </button>
                  <button
                    onClick={() => setPaymentInfo((prev) => ({ ...prev, paymentMethod: "cod" }))}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                      paymentInfo.paymentMethod === "cod"
                        ? "border-accent bg-accent/10"
                        : "border-border-light hover:border-accent dark:border-border-dark"
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">payments</span>
                    <span className="text-sm font-medium">Cash on Delivery</span>
                  </button>
                </div>

                {paymentInfo.paymentMethod === "card" && (
                  <div className="grid gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Card Number *</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={(e) =>
                            setPaymentInfo((prev) => ({
                              ...prev,
                              cardNumber: formatCardNumber(e.target.value),
                            }))
                          }
                          maxLength={19}
                          className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 pr-12 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-border-dark dark:bg-background-dark"
                          placeholder="1234 5678 9012 3456"
                        />
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">
                          credit_card
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Name on Card *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-border-dark dark:bg-background-dark"
                        placeholder="JOHN DOE"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Expiry Date *</label>
                        <input
                          type="text"
                          name="expiry"
                          value={paymentInfo.expiry}
                          onChange={(e) =>
                            setPaymentInfo((prev) => ({
                              ...prev,
                              expiry: formatExpiry(e.target.value),
                            }))
                          }
                          maxLength={5}
                          className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-border-dark dark:bg-background-dark"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">CVV *</label>
                        <input
                          type="password"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          maxLength={4}
                          className="w-full rounded-lg border border-border-light bg-background-light px-4 py-2 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-border-dark dark:bg-background-dark"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentInfo.paymentMethod === "paypal" && (
                  <div className="rounded-lg bg-background-light p-6 text-center dark:bg-background-dark">
                    <img
                      src="https://cdn-icons-png.flaticon.com/64/196/196565.png"
                      alt="PayPal"
                      className="mx-auto mb-4 h-12"
                    />
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">
                      You will be redirected to PayPal to complete your payment.
                    </p>
                  </div>
                )}

                {paymentInfo.paymentMethod === "cod" && (
                  <div className="rounded-lg bg-background-light p-6 text-center dark:bg-background-dark">
                    <span className="material-symbols-outlined mb-4 text-4xl text-accent">payments</span>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">
                      Pay with cash when your order is delivered.
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-accent hover:underline"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to Shipping
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || (paymentInfo.paymentMethod === "card" && !validatePayment())}
                    className="flex items-center gap-2 rounded-lg bg-accent px-6 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">lock</span>
                        Place Order (${total.toFixed(2)})
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Shipping Info Review */}
            {step === 2 && (
              <div className="mt-4 rounded-xl bg-card-light p-4 dark:bg-card-dark">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Shipping to:</h3>
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-accent hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="mt-2 text-sm text-subtle-light dark:text-subtle-dark">
                  {shippingInfo.firstName} {shippingInfo.lastName}
                  <br />
                  {shippingInfo.address}
                  <br />
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                  <br />
                  {shippingInfo.country}
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl bg-card-light p-6 dark:bg-card-dark">
              <h2 className="mb-4 text-lg font-bold">Order Summary</h2>

              {/* Cart Items */}
              <div className="max-h-64 space-y-3 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={item.images?.[0] || item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-accent">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-border-light pt-4 dark:border-border-dark">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-subtle-light dark:text-subtle-dark">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-subtle-light dark:text-subtle-dark">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-subtle-light dark:text-subtle-dark">Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-4 border-t border-border-light pt-4 dark:border-border-dark">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-accent">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-subtle-light dark:text-subtle-dark">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-green-500">verified_user</span>
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-accent">local_shipping</span>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-accent">cached</span>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
