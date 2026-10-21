import { useState, useEffect, useMemo, useCallback } from "react";
import request from "../../../utils/request";

// Helper function to generate unique IDs
const generateId = (prefix) => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}${timestamp}${random}`.toUpperCase();
};

// Map payment method to pay_method code
const payMethodMap = {
  cash: "PAY01",
  card: "PAY02",
  qr: "PAY03",
  transfer: "PAY04",
};

const usePos = () => {
  // ── State ──
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Card payment state
  const [showCardModal, setShowCardModal] = useState(false);//const showCardModal = false;
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  // ── Fetch Data ──
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await request("api/product", "GET");
      if (response.success && response.data.length > 0) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("API unavailable, using sample data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await request("api/category", "GET");
      if (response.success && response.data.length > 0) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // ── Filtered Products ──
  const filteredProducts = useMemo(() => {
    let list = products;
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category_id === activeCategory.code);
    }
    if (search.trim()) {
      const kw = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.prd_name && p.prd_name.toLowerCase().includes(kw)) ||
          (p.prd_id && p.prd_id.toLowerCase().includes(kw))
      );
    }
    return list;
  }, [products, activeCategory, search]);

  // ── Category Handler ──
  function handleCategoryClick(category) {
    setActiveCategory(category);
  }

  // ── Cart Helpers ──
  function addToCart(product) {
    setCart((prev) => {
      const exists = prev.find((c) => c.prd_id === product.prd_id);
      if (exists) {
        return prev.map((c) =>
          c.prd_id === product.prd_id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function updateQty(prdId, delta) {
    setCart((prev) =>
      prev
        .map((c) => (c.prd_id === prdId ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  }

  function removeItem(prdId) {
    setCart((prev) => prev.filter((c) => c.prd_id !== prdId));
  }

  function clearCart() { setCart([]); }

  // ── Totals ──
  const subtotal = useMemo(
    () => cart.reduce((s, c) => s + c.unit_cost * c.qty, 0),
    [cart]
  );
  const discount = 0;
  const tax = 0;
  const total = subtotal - discount + tax;
  const change = cashReceived ? parseFloat(cashReceived) - total : 0;

  // ── Card Input Handler ──
  function handleCardInputChange(field, value) {
    setCardDetails((prev) => ({ ...prev, [field]: value }));
  }

  function openCardModal() {
    if (cart.length === 0) return alert("Cart is empty!");
    setShowCardModal(true); // Open card input modal , showCardModal = true
  }

  function closeCardModal() {
    setShowCardModal(false);
  }

  async function processCardPayment() {
    // Validate card details
    if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, "").length < 16) {
      return alert("Please enter a valid card number");
    }
    if (!cardDetails.cardHolder) {
      return alert("Please enter card holder name");
    }
    if (!cardDetails.expiryDate || cardDetails.expiryDate.length < 5) {
      return alert("Please enter a valid expiry date");
    }
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      return alert("Please enter a valid CVV");
    }

    setShowCardModal(false);
    setShowPaymentModal(true);
    setProcessing(true);

    try {
      // Prepare sale data
      const now = new Date();
      const saleData = {
        sale_id: generateId("S"),
        invoice_id: generateId("INV-"),
        sale_date: now.toISOString().split("T")[0],
        amount: total,
        sub_total: subtotal,
        tax: tax,
        pay_method: payMethodMap["card"],
        create_by: "admin",
        created_on: now.toISOString(),
        saleItems: cart.map((item) => ({
          prd_id: item.prd_id,
          qty: item.qty,
          price: item.unit_cost,
        })),
      };

      // Save to API using request utility
      await request("api/sale", "POST", saleData);

      setProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        clearCart();
        setCardDetails({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" });
      }, 2000);
    } catch (error) {
      console.error("Card payment failed:", error);
      setProcessing(false);
      setShowPaymentModal(false);
      alert("Card payment failed. Please try again.");
    }
  }

  // ── Checkout / Payment ──
  async function handleCheckout() {
    if (cart.length === 0) return alert("Cart is empty!");
    if (paymentMethod === "cash" && parseFloat(cashReceived || 0) < total) {
      return alert("Insufficient cash received!");
    }
    // For card payment, open card input modal first
    if (paymentMethod === "card") {
      openCardModal();
      return;
    }
    setShowPaymentModal(true);
    setProcessing(true);

    try {
      // Different processing times based on payment method
      const processingTime =
        paymentMethod === "qr" || paymentMethod === "transfer" ? 4000 : 2000;
      await new Promise((resolve) => setTimeout(resolve, processingTime));

      // Prepare sale data
      const now = new Date();// current date for sale_date and created_on
      const saleData = {
        sale_id: generateId("S"),
        invoice_id: generateId("INV-"),
        sale_date: now.toISOString().split("T")[0],
        amount: total,
        sub_total: subtotal,
        tax: tax,
        pay_method: payMethodMap[paymentMethod],
        create_by: "admin",
        created_on: now.toISOString(),
        saleItems: cart.map((item) => ({
          prd_id: item.prd_id,
          qty: item.qty,
          price: item.unit_cost,
        })),
      };

      // Save to API using request utility
      await request("api/sale", "POST", saleData);

      setProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        clearCart();
        setCashReceived("");
      }, 2000);
    } catch (error) {
      console.error("Payment failed:", error);
      setProcessing(false);
      setShowPaymentModal(false);
      alert("Payment failed. Please try again.");
    }
  }

  function closeModal() {
    if (!processing) {
      setShowPaymentModal(false);
      setPaymentSuccess(false);
    }
  }

  // ── Format Price ──
  function fmt(v) { return `$${Number(v || 0).toFixed(2)}`; }

  return {
    // State
    products,
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
    closeModal,
    fmt,
    handleCardInputChange,
    closeCardModal,
    processCardPayment,
  };
};

export default usePos;
