import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import request from "../../../utils/request";

const API_BASE_URL = "http://localhost:3000";
const FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDnWA3R0m9y899YwaQX4jlS5mV4KX6meTGi-yj1WuvXRENDDVctlhO0L8h93LpGw-tyxtts1ijDVWO0oeSIKTst-rTLd62zYBvYBe8CKlgb4qkfSHhWiNeVFQXqVllZ4r8Vphat_twk9Pdo8gHWXQgrnb4g3E2rcZaQfXfHUIbHyZ9enuqdnk3Xoc5T7E04NV6sz5tG443BmRin00wyQCqWm9KGRehLMH9kDXGgdvQKBXBT0H_bnfz5ORjpSPBGIpCkKD_ik-tl5dwL";

const formatPrice = (value) => {
  const amount = Number(value || 0);
  return `$${amount.toFixed(2)}`;
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getCartCount } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await request(`api/product/${id}`, "GET");
        const item = response?.data;

        if (item) {
          const mappedProduct = {
            id: item.prd_id,
            brand: item.brand_name || "Generic Brand",
            name: item.prd_name || "Unnamed Product",
            price: formatPrice(item.unit_cost),
            rawPrice: Number(item.unit_cost || 0),
            description: item.description || "No description available for this product.",
            category: item.category_name || "Uncategorized",
            stock: item.qty || 0,
            rating: 4.5,
            reviews: 128,
            images: item.photo
              ? [`${API_BASE_URL}${item.photo}`]
              : [FALLBACK_IMAGE],
          };
          setProduct(mappedProduct);
        } else {
          setErrorMessage("Product not found");
        }
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message || "Cannot load product details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate("/index/checkout");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent mx-auto"></div>
          <p className="mt-4 text-subtle-light dark:text-subtle-dark">Loading product...</p>
        </div>
      </div>
    );
  }

  if (errorMessage || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined text-6xl text-subtle-light dark:text-subtle-dark">error</span>
        <p className="mt-4 text-lg text-red-500">{errorMessage || "Product not found"}</p>
        <Link to="/index" className="mt-4 rounded-lg bg-accent px-6 py-2 text-white">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light font-display text-text-light dark:bg-background-dark dark:text-text-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border-light bg-background-light/80 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/index" className="flex items-center gap-3 text-primary dark:text-white">
              <span className="material-symbols-outlined text-2xl">storefront</span>
              <h1 className="text-xl font-bold">Shopify</h1>
            </Link>
            <nav className="hidden items-center gap-8 md:flex">
              <Link className="text-sm font-medium hover:text-accent" to="/index">Home</Link>
              <Link className="text-sm font-medium hover:text-accent" to="/index">Shop</Link>
              <Link className="text-sm font-medium hover:text-accent" to="#">About</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
              <span className="material-symbols-outlined">person</span>
            </button>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <Link to="/index/cart" className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
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
          <Link to="/index" className="hover:text-accent">Home</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <Link to="/index" className="hover:text-accent">Shop</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-text-light dark:text-text-dark">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-card-light dark:bg-card-dark">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index
                        ? "border-accent"
                        : "border-transparent hover:border-border-light dark:hover:border-border-dark"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-subtle-light dark:text-subtle-dark">{product.brand}</p>
              <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-accent">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`material-symbols-outlined !text-lg ${
                      star <= Math.floor(product.rating) ? "" : "text-border-light dark:text-border-dark"
                    }`}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="text-sm text-subtle-light dark:text-subtle-dark">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-accent">{product.price}</div>

            {/* Description */}
            <div>
              <h3 className="mb-2 font-bold">Description</h3>
              <p className="text-subtle-light dark:text-subtle-dark">{product.description}</p>
            </div>

            {/* Category & Stock */}
            <div className="flex flex-wrap gap-4">
              <div className="rounded-lg bg-card-light px-4 py-2 dark:bg-card-dark">
                <span className="text-sm text-subtle-light dark:text-subtle-dark">Category:</span>
                <span className="ml-2 font-medium">{product.category}</span>
              </div>
              <div className="rounded-lg bg-card-light px-4 py-2 dark:bg-card-dark">
                <span className="text-sm text-subtle-light dark:text-subtle-dark">Stock:</span>
                <span className={`ml-2 font-medium ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                  {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center rounded-lg border border-border-light dark:border-border-dark">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="flex h-10 w-10 items-center justify-center hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border-2 border-accent text-accent transition-all hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined">add_shopping_cart</span>
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-accent text-white transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                Buy Now
              </button>
            </div>

            {/* Added to Cart Message */}
            {showAddedMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-green-100 p-4 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <span className="material-symbols-outlined">check_circle</span>
                <span>Added to cart successfully!</span>
                <Link to="/index/cart" className="ml-auto font-medium underline">
                  View Cart
                </Link>
              </div>
            )}

            {/* Additional Info */}
            <div className="space-y-3 rounded-lg bg-card-light p-4 dark:bg-card-dark">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-accent">local_shipping</span>
                <span className="text-sm">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-accent">cached</span>
                <span className="text-sm">30-day return policy</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-accent">verified_user</span>
                <span className="text-sm">Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border-light bg-card-light dark:border-border-dark dark:bg-card-dark">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-subtle-light dark:text-subtle-dark sm:px-6 lg:px-8">
          <p>© 2024 Shopify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetailPage;
