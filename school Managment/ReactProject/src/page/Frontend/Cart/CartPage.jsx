import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    navigate("/index/checkout");
  };

  return (
    <div className="min-h-screen bg-background-light font-display text-text-light dark:bg-background-dark dark:text-text-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border-light bg-background-light/80 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/frontend" className="flex items-center gap-3 text-primary dark:text-white">
              <span className="material-symbols-outlined text-2xl">storefront</span>
              <h1 className="text-xl font-bold">Shopify</h1>
            </Link>
            <nav className="hidden items-center gap-8 md:flex">
              <Link className="text-sm font-medium hover:text-accent" to="/frontend">Home</Link>
              <Link className="text-sm font-medium hover:text-accent" to="/frontend">Shop</Link>
              <Link className="text-sm font-medium hover:text-accent" to="#">About</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
              <span className="material-symbols-outlined">person</span>
            </button>
            <Link to="/frontend/cart" className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <span className="material-symbols-outlined">shopping_bag</span>
              {getCartCount() > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-subtle-light dark:text-subtle-dark">
          <Link to="/frontend" className="hover:text-accent">Home</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-text-light dark:text-text-dark">Shopping Cart</span>
        </nav>
      </div>

      {/* Cart Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="material-symbols-outlined text-8xl text-subtle-light dark:text-subtle-dark">shopping_cart</span>
            <h2 className="mt-4 text-xl font-bold">Your cart is empty</h2>
            <p className="mt-2 text-subtle-light dark:text-subtle-dark">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/frontend"
              className="mt-6 flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-bold text-white transition-transform hover:scale-105"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="rounded-xl bg-card-light p-6 dark:bg-card-dark">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">{getCartCount()} Items</h2>
                  <button
                    onClick={clearCart}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-border-light dark:divide-border-dark">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4">
                      <Link
                        to={`/frontend/product/${item.id}`}
                        className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg"
                      >
                        <img
                          src={item.images?.[0] || item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-subtle-light dark:text-subtle-dark">
                              {item.brand}
                            </p>
                            <Link
                              to={`/frontend/product/${item.id}`}
                              className="font-bold hover:text-accent"
                            >
                              {item.name}
                            </Link>
                          </div>
                          <p className="text-lg font-bold text-accent">{item.price}</p>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-border-light dark:border-border-dark">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex h-8 w-8 items-center justify-center hover:bg-black/5 dark:hover:bg-white/5"
                            >
                              <span className="material-symbols-outlined text-base">remove</span>
                            </button>
                            <span className="w-10 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex h-8 w-8 items-center justify-center hover:bg-black/5 dark:hover:bg-white/5"
                            >
                              <span className="material-symbols-outlined text-base">add</span>
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                          >
                            <span className="material-symbols-outlined text-base">close</span>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/frontend"
                className="mt-4 flex items-center gap-2 text-sm text-accent hover:underline"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-xl bg-card-light p-6 dark:bg-card-dark">
                <h2 className="mb-4 text-lg font-bold">Order Summary</h2>

                <div className="space-y-3">
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
                  <div className="border-t border-border-light pt-3 dark:border-border-dark">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-accent">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-sm text-accent">
                    <span className="material-symbols-outlined text-base">local_shipping</span>
                    <span>Add ${(50 - subtotal).toFixed(2)} more for free shipping!</span>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  <span className="material-symbols-outlined">lock</span>
                  Proceed to Checkout
                </button>

                <div className="mt-4 flex items-center justify-center gap-4">
                  <img src="https://cdn-icons-png.flaticon.com/32/196/196578.png" alt="Visa" className="h-6" />
                  <img src="https://cdn-icons-png.flaticon.com/32/196/196561.png" alt="MasterCard" className="h-6" />
                  <img src="https://cdn-icons-png.flaticon.com/32/196/196565.png" alt="PayPal" className="h-6" />
                </div>

                <div className="mt-4 space-y-2 text-center text-xs text-subtle-light dark:text-subtle-dark">
                  <div className="flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-base">verified_user</span>
                    <span>Secure 256-bit SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-subtle-light dark:text-subtle-dark sm:px-6 lg:px-8">
          <p>© 2024 Shopify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;
