import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import request from "../utils/request";

const ReportsPage = () => {
  const location = useLocation();
  
  const getInitialTab = () => {
    const path = location.pathname;
    if (path.includes("/reports/sales")) return "sales";
    if (path.includes("/reports/inventory")) return "inventory";
    if (path.includes("/reports/customer")) return "customers";
    return "sales";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [salesData, setSalesData] = useState({ data: [], summary: {} });
  const [inventoryData, setInventoryData] = useState([]);
  const [inventorySummary, setInventorySummary] = useState({});
  const [customerStats, setCustomerStats] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // Filter states
  const [period, setPeriod] = useState("daily");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const currentDateTime = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);

  useEffect(() => {
    fetchReportData();
    fetchFilters();
  }, [activeTab, period]);

  const fetchFilters = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        request("api/category", "GET"),
        request("api/brand", "GET"),
      ]);
      if (catRes?.success) setCategories(catRes.data || []);
      if (brandRes?.success) setBrands(brandRes.data || []);
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "sales":
          const [salesRes, paymentRes] = await Promise.all([
            request(`api/report/sales?period=${period}`, "GET"),
            request("api/report/sales/payment-methods", "GET"),
          ]);
          if (salesRes?.success) setSalesData(salesRes);
          if (paymentRes?.success) setPaymentMethods(paymentRes.data);
          break;
        case "inventory":
          const [invRes, productsRes] = await Promise.all([
            request("api/report/inventory", "GET"),
            request("api/product", "GET"),
          ]);
          if (invRes?.success) setInventorySummary(invRes.data);
          if (productsRes?.success) setInventoryData(productsRes.data || []);
          break;
        case "customers":
          const custRes = await request("api/report/customers", "GET");
          if (custRes?.success) setCustomerStats(custRes.data);
          break;
      }
    } catch (error) {
      console.error("Failed to fetch report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "0000-00-00") return "-";
    return new Date(dateStr).toLocaleDateString();
  };

  const getStockStatus = (qty) => {
    if (qty <= 0) return { label: "OUT OF STOCK", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" };
    if (qty < 10) return { label: "LOW STOCK", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" };
    return { label: "AVAILABLE", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" };
  };

  const handleFilter = () => {
    fetchReportData();
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedStatus("");
    setPeriod("daily");
  };

  const exportToCSV = () => {
    let data = [];
    let filename = "";
    
    if (activeTab === "inventory") {
      filename = "inventory_report.csv";
      const headers = ["Product ID", "Product Name", "Category", "Brand", "Qty", "Unit Cost", "Total Value", "Status"];
      data = [headers.join(",")];
      filteredInventory.forEach((item) => {
        const row = [
          item.prd_id,
          `"${item.prd_name}"`,
          item.category_id,
          item.brand_id,
          item.qty,
          item.unit_cost,
          (item.qty * item.unit_cost).toFixed(2),
          getStockStatus(item.qty).label,
        ];
        data.push(row.join(","));
      });
    } else if (activeTab === "sales") {
      filename = "sales_report.csv";
      const headers = ["Date", "Orders", "Sales"];
      data = [headers.join(",")];
      salesData.data?.forEach((item) => {
        data.push([item.date, item.orders, item.sales].join(","));
      });
    } else if (activeTab === "customers") {
      filename = "customer_report.csv";
      const headers = ["Customer", "Email", "Orders", "Total Spent"];
      data = [headers.join(",")];
      customerStats.topCustomers?.forEach((c) => {
        data.push([`"${c.fullname}"`, c.gmail, c.orderCount, c.totalSpent].join(","));
      });
    }

    const blob = new Blob([data.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  // Filter inventory data
  const filteredInventory = inventoryData.filter((item) => {
    const matchSearch = !searchTerm || 
      item.prd_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.prd_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !selectedCategory || item.category_id === selectedCategory;
    const matchBrand = !selectedBrand || item.brand_id === selectedBrand;
    const matchStatus = !selectedStatus || 
      (selectedStatus === "available" && item.qty > 0) ||
      (selectedStatus === "outofstock" && item.qty <= 0);
    return matchSearch && matchCategory && matchBrand && matchStatus;
  });

  // Styles
  const styles = {
    container: {
      backgroundColor: "#1a1d29",
      minHeight: "100vh",
      padding: "20px",
      color: "#fff",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "20px",
    },
    title: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "24px",
      fontWeight: "bold",
      margin: 0,
    },
    dateTime: {
      fontSize: "14px",
      color: "#888",
      marginTop: "5px",
    },
    exportButtons: {
      display: "flex",
      gap: "10px",
    },
    exportBtn: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      fontSize: "14px",
    },
    csvBtn: { backgroundColor: "#10b981", color: "#fff" },
    pdfBtn: { backgroundColor: "#ef4444", color: "#fff" },
    excelBtn: { backgroundColor: "#22c55e", color: "#fff" },
    filterSection: {
      backgroundColor: "#252836",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "20px",
    },
    filterGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "15px",
      marginBottom: "15px",
    },
    filterLabel: {
      fontSize: "12px",
      color: "#888",
      marginBottom: "8px",
      textTransform: "uppercase",
      fontWeight: "600",
    },
    filterInput: {
      width: "100%",
      padding: "12px 15px",
      backgroundColor: "#2d303e",
      border: "none",
      borderRadius: "8px",
      color: "#fff",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
    },
    filterSelect: {
      width: "100%",
      padding: "12px 15px",
      backgroundColor: "#2d303e",
      border: "none",
      borderRadius: "8px",
      color: "#fff",
      fontSize: "14px",
      outline: "none",
      cursor: "pointer",
      boxSizing: "border-box",
    },
    filterButtons: {
      display: "flex",
      gap: "10px",
    },
    filterBtn: {
      padding: "10px 25px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
    },
    primaryBtn: { backgroundColor: "#10b981", color: "#fff" },
    secondaryBtn: { backgroundColor: "#3d4152", color: "#fff" },
    tableSection: {
      backgroundColor: "#252836",
      borderRadius: "12px",
      padding: "20px",
      overflow: "hidden",
    },
    tableTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      textAlign: "left",
      padding: "15px 12px",
      fontSize: "12px",
      textTransform: "uppercase",
      color: "#888",
      fontWeight: "600",
      borderBottom: "1px solid #3d4152",
    },
    td: {
      padding: "15px 12px",
      borderBottom: "1px solid #2d303e",
      fontSize: "14px",
    },
    statusBadge: (status) => ({
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "bold",
      backgroundColor: status.bg,
      color: status.color,
      border: `1px solid ${status.color}`,
      display: "inline-block",
    }),
    summaryCards: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "15px",
      marginBottom: "20px",
    },
    summaryCard: {
      backgroundColor: "#252836",
      borderRadius: "12px",
      padding: "20px",
      textAlign: "center",
    },
    summaryValue: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#10b981",
      marginBottom: "5px",
    },
    summaryLabel: {
      fontSize: "14px",
      color: "#888",
    },
    tabs: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },
    tab: (isActive) => ({
      padding: "12px 24px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      backgroundColor: isActive ? "#10b981" : "#252836",
      color: isActive ? "#fff" : "#888",
      transition: "all 0.2s",
    }),
  };

  const getReportTitle = () => {
    switch (activeTab) {
      case "sales": return "📊 Sales Report";
      case "inventory": return "📦 Stock Report";
      case "customers": return "👥 Customer Report";
      default: return "Report";
    }
  };

  const renderSalesReport = () => (
    <>
      {/* Summary Cards */}
      <div style={styles.summaryCards}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{formatCurrency(salesData.summary?.totalSales)}</div>
          <div style={styles.summaryLabel}>Total Sales</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{salesData.summary?.totalOrders || 0}</div>
          <div style={styles.summaryLabel}>Total Orders</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{formatCurrency(salesData.summary?.averageOrderValue)}</div>
          <div style={styles.summaryLabel}>Average Order</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{paymentMethods.length}</div>
          <div style={styles.summaryLabel}>Payment Methods</div>
        </div>
      </div>

      {/* Filter */}
      <div style={styles.filterSection}>
        <div style={{ display: "flex", gap: "15px", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <div style={styles.filterLabel}>Period</div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <button style={{ ...styles.filterBtn, ...styles.primaryBtn }} onClick={handleFilter}>
            🔍 Filter
          </button>
          <button style={{ ...styles.filterBtn, ...styles.secondaryBtn }} onClick={handleReset}>
            ↻ Reset
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div style={styles.tableSection}>
        <div style={styles.tableTitle}>📈 Sales by {period.charAt(0).toUpperCase() + period.slice(1)}</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Date</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Orders</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Sales Amount</th>
            </tr>
          </thead>
          <tbody>
            {salesData.data?.length > 0 ? (
              salesData.data.map((item, index) => (
                <tr key={index}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={{ ...styles.td, fontWeight: "bold" }}>{item.date}</td>
                  <td style={{ ...styles.td, textAlign: "right" }}>{item.orders}</td>
                  <td style={{ ...styles.td, textAlign: "right", color: "#10b981" }}>
                    {formatCurrency(item.sales)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ ...styles.td, textAlign: "center", color: "#888" }}>
                  No sales data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Methods Table */}
      <div style={{ ...styles.tableSection, marginTop: "20px" }}>
        <div style={styles.tableTitle}>💳 Sales by Payment Method</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Payment Method</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Orders</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods?.length > 0 ? (
              paymentMethods.map((pm, index) => (
                <tr key={index}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={{ ...styles.td, fontWeight: "bold" }}>{pm.method || "Unknown"}</td>
                  <td style={{ ...styles.td, textAlign: "right" }}>{pm.count}</td>
                  <td style={{ ...styles.td, textAlign: "right", color: "#10b981" }}>
                    {formatCurrency(pm.total)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ ...styles.td, textAlign: "center", color: "#888" }}>
                  No payment data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderInventoryReport = () => (
    <>
      {/* Summary Cards */}
      <div style={styles.summaryCards}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{inventorySummary.totalProducts || 0}</div>
          <div style={styles.summaryLabel}>Total Products</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{inventorySummary.totalStock || 0}</div>
          <div style={styles.summaryLabel}>Total Stock</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{formatCurrency(inventorySummary.totalValue)}</div>
          <div style={styles.summaryLabel}>Inventory Value</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={{ ...styles.summaryValue, color: "#ef4444" }}>{inventorySummary.outOfStock || 0}</div>
          <div style={styles.summaryLabel}>Out of Stock</div>
        </div>
      </div>

      {/* Filter */}
      <div style={styles.filterSection}>
        <div style={styles.filterGrid}>
          <div>
            <div style={styles.filterLabel}>Search Product</div>
            <input
              type="text"
              placeholder="Product ID or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.filterInput}
            />
          </div>
          <div>
            <div style={styles.filterLabel}>Category</div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.code} value={cat.code}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <div style={styles.filterLabel}>Brand</div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.code} value={brand.code}>{brand.name}</option>
              ))}
            </select>
          </div>
          <div>
            <div style={styles.filterLabel}>Status</div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="outofstock">Out of Stock</option>
            </select>
          </div>
        </div>
        <div style={styles.filterButtons}>
          <button style={{ ...styles.filterBtn, ...styles.primaryBtn }} onClick={handleFilter}>
            🔍 Filter
          </button>
          <button style={{ ...styles.filterBtn, ...styles.secondaryBtn }} onClick={handleReset}>
            ↻ Reset
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div style={styles.tableSection}>
        <div style={styles.tableTitle}>📦 Detailed Inventory</div>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Product ID</th>
                <th style={styles.th}>Product Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Brand</th>
                <th style={styles.th}>Stock Date</th>
                <th style={styles.th}>Exp Date</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Qty</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Unit Cost</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Total Value</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Remark</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item, index) => {
                  const status = getStockStatus(item.qty);
                  return (
                    <tr key={item.prd_id}>
                      <td style={styles.td}>{index + 1}</td>
                      <td style={{ ...styles.td, fontWeight: "bold" }}>{item.prd_id}</td>
                      <td style={styles.td}>{item.prd_name}</td>
                      <td style={styles.td}>{item.category_id}</td>
                      <td style={styles.td}>{item.brand_id}</td>
                      <td style={styles.td}>{formatDate(item.stock_date)}</td>
                      <td style={styles.td}>{formatDate(item.exp_date)}</td>
                      <td style={{ ...styles.td, textAlign: "right", color: item.qty <= 0 ? "#ef4444" : "#10b981", fontWeight: "bold" }}>
                        {item.qty}
                      </td>
                      <td style={{ ...styles.td, textAlign: "right" }}>{formatCurrency(item.unit_cost)}</td>
                      <td style={{ ...styles.td, textAlign: "right" }}>{formatCurrency(item.qty * item.unit_cost)}</td>
                      <td style={styles.td}>
                        <span style={styles.statusBadge(status)}>{status.label}</span>
                      </td>
                      <td style={styles.td}>{item.remark || "-"}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="12" style={{ ...styles.td, textAlign: "center", color: "#888" }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderCustomersReport = () => (
    <>
      {/* Summary Cards */}
      <div style={styles.summaryCards}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{customerStats.totalCustomers || 0}</div>
          <div style={styles.summaryLabel}>Total Customers</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{customerStats.activeCustomers || 0}</div>
          <div style={styles.summaryLabel}>Active Customers</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>{customerStats.topCustomers?.length || 0}</div>
          <div style={styles.summaryLabel}>Top Customers</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryValue}>
            {formatCurrency(
              customerStats.topCustomers?.reduce((sum, c) => sum + parseFloat(c.totalSpent || 0), 0)
            )}
          </div>
          <div style={styles.summaryLabel}>Total Revenue</div>
        </div>
      </div>

      {/* Top Customers Table */}
      <div style={styles.tableSection}>
        <div style={styles.tableTitle}>🏆 Top Customers</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Customer ID</th>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Email</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Orders</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Total Spent</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {customerStats.topCustomers?.length > 0 ? (
              customerStats.topCustomers.map((customer, index) => (
                <tr key={customer.customer_id || index}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={{ ...styles.td, fontWeight: "bold" }}>{customer.customer_id || "-"}</td>
                  <td style={styles.td}>{customer.fullname || "Guest"}</td>
                  <td style={styles.td}>{customer.gmail || "-"}</td>
                  <td style={{ ...styles.td, textAlign: "right", fontWeight: "bold" }}>{customer.orderCount}</td>
                  <td style={{ ...styles.td, textAlign: "right", color: "#10b981" }}>
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge({ label: "ACTIVE", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" })}>
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ ...styles.td, textAlign: "center", color: "#888" }}>
                  No customer data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  const tabs = [
    { id: "sales", label: "📊 Sales Report" },
    { id: "inventory", label: "📦 Stock Report" },
    { id: "customers", label: "👥 Customer Report" },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{getReportTitle()}</h1>
          <div style={styles.dateTime}>📅 {currentDateTime}</div>
        </div>
        <div style={styles.exportButtons}>
          <button style={{ ...styles.exportBtn, ...styles.csvBtn }} onClick={exportToCSV}>
            📄 CSV
          </button>
          <button style={{ ...styles.exportBtn, ...styles.pdfBtn }} onClick={() => window.print()}>
            📑 PDF
          </button>
          <button style={{ ...styles.exportBtn, ...styles.excelBtn }} onClick={exportToCSV}>
            📊 Excel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={styles.tab(activeTab === tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
          <p>Loading report data...</p>
        </div>
      ) : (
        <>
          {activeTab === "sales" && renderSalesReport()}
          {activeTab === "inventory" && renderInventoryReport()}
          {activeTab === "customers" && renderCustomersReport()}
        </>
      )}
    </div>
  );
};

export default ReportsPage;
