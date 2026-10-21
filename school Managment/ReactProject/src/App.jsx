import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./page/Dashboard";
import PosPage from "./page/feature/pos/PosPage";
import CustomersPage from "./page/CustomersPage";
import ReportsPage from "./page/ReportsPage";
import CategoryPage from "./page/feature/category/categoryPage";
import BrandPage from "./page/feature/brand/BrandPage";
import ProductPage from "./page/feature/products/ProductPage";
import Login from "./page/feature/login/login";
import MainPage from "./page/Frontend/HomePage/MainPage";
import Setting from "./page/feature/setting/Setting";
//import SalesPage from "./page/SalesPage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProductDetailPage from "./page/Frontend/ProductDetail/ProductDetailPage";
import CartPage from "./page/Frontend/Cart/CartPage";
import CheckoutPage from "./page/Frontend/Checkout/CheckoutPage";
import CustomerLogin from "./page/Frontend/Auth/CustomerLogin";
import CustomerRegister from "./page/Frontend/Auth/CustomerRegister";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* admin routes */}
          <Route element={<Layout />}>
           <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/sales" element={<PosPage />} />
            {/* <Route path="/sales/history" element={<SalesPage />} /> */}
            <Route path="/sales/new" element={<PosPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/sales" element={<ReportsPage />} />
            <Route path="/reports/inventory" element={<ReportsPage />} />
            <Route path="/reports/customer" element={<ReportsPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/brands" element={<BrandPage />} />
            <Route path="/pos" element={<PosPage />} />
            <Route path="/setting" element={<Setting/> } />
          </Route>
          <Route path="*" element={<h2>Page not found</h2>} />
          {/* Frontend Customer Routes */}
          <Route path="/index" element={<MainPage />} />
          <Route path="/index/product/:id" element={<ProductDetailPage />} />
          <Route path="/index/cart" element={<CartPage />} />
          <Route path="/index/checkout" element={<CheckoutPage />} />
          <Route path="/index/login" element={<CustomerLogin />} />
          <Route path="/index/register" element={<CustomerRegister />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
