import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import request from "../utils/request";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Chart, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FaDollarSign, FaChartBar, FaBox, FaUsers } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salesByPayment, setSalesByPayment] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, paymentRes, monthlyRes] = await Promise.all([
          request("api/report/dashboard", "GET"),
          request("api/report/sale/payment-methods", "GET"),
          request("api/report/sale/monthly", "GET"),
        ]);

        if (dashboardRes?.success) {
          setStats(dashboardRes.data);
        }
        if (paymentRes?.success) {
          setSalesByPayment(paymentRes.data);
        }
        if (monthlyRes?.success) {
          setMonthlySales(monthlyRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value || 0);
  };

  // Styles
  const styles = {
    container: {
      padding: "24px",
      backgroundColor: "#f5f7fa",
      minHeight: "100vh",
      color: "#333",
    },
    header: {
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: "24px",
      color: "#1a1a2e",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "20px",
      marginBottom: "24px",
    },
    statCard: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      border: "1px solid #e8e8e8",
    },
    statIcon: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
      marginBottom: "12px",
    },
    statLabel: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "8px",
    },
    statValue: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1a1a2e",
    },
    chartsRow: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "20px",
      marginBottom: "24px",
    },
    chartCard: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      border: "1px solid #e8e8e8",
    },
    chartTitle: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "16px",
      color: "#1a1a2e",
    },
    chartContainer: {
      height: "300px",
      position: "relative",
    },
  };

  // Combined Bar + Line Chart Data - Using real data from Sale table
  const monthLabels = monthlySales.length > 0 
    ? monthlySales.map(m => m.monthName) 
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Get sales amounts and transaction counts from API data
  const salesAmounts = monthlySales.length > 0 
    ? monthlySales.map(m => m.totalAmount) 
    : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  
  const transactionCounts = monthlySales.length > 0 
    ? monthlySales.map(m => m.totalTransactions) 
    : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Calculate trend lines based on sales amounts
  const maxSales = Math.max(...salesAmounts, 1);
  const trendLineA = salesAmounts.map(v => (v / maxSales) * 70 + 10);
  const trendLineB = salesAmounts.map((v, i) => {
    const prev = salesAmounts[i - 1] || v;
    return ((v + prev) / 2 / maxSales) * 60 + 15;
  });

  const combinedChartData = {
    labels: monthLabels,
    datasets: [
      {
        type: "bar",
        label: "Transactions",
        data: transactionCounts,
        backgroundColor: "rgba(32, 101, 209, 0.85)",
        borderRadius: 4,
        barThickness: 20,
        order: 2,
        yAxisID: "y1",
      },
      {
        type: "line",
        label: "Sales Amount",
        data: salesAmounts,
        borderColor: "#2065D1",
        backgroundColor: "transparent",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#2065D1",
        order: 1,
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Trend",
        data: trendLineA,
        borderColor: "#FFAB00",
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        borderDash: [5, 5],
        order: 1,
        yAxisID: "y1",
      },
    ],
  };

  const combinedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          color: "#637381",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 13,
          },
        },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#212B36",
        bodyColor: "#637381",
        borderColor: "#e0e0e0",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.yAxisID === 'y') {
              label += '$' + context.parsed.y.toLocaleString();
            } else {
              label += context.parsed.y;
            }
            return label;
          }
        }
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#919EAB",
          font: {
            size: 12,
          },
        },
      },
      y: {
        type: "linear",
        position: "left",
        grid: {
          color: "rgba(145, 158, 171, 0.2)",
          drawBorder: false,
        },
        ticks: {
          color: "#919EAB",
          font: {
            size: 12,
          },
          callback: (value) => "$" + value.toLocaleString(),
        },
        title: {
          display: true,
          text: "Sales Amount ($)",
          color: "#637381",
        },
      },
      y1: {
        type: "linear",
        position: "right",
        grid: {
          display: false,
        },
        ticks: {
          color: "#919EAB",
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: "Transactions",
          color: "#637381",
        },
      },
    },
  };

  // Pie Chart Data - Sales by Payment Method
  const pieColors = [
    "#2065D1",  // Blue
    "#00B8D9",  // Light Blue
    "#FFAB00",  // Yellow
    "#FF5630",  // Red/Coral
    "#36B37E",  // Green
    "#9C27B0",  // Purple
  ];

  const pieChartData = {
    labels: salesByPayment.length > 0 
      ? salesByPayment.map((p) => p.payment_method || "Unknown") 
      : ["ABA", "Aceleda", "Wing", "Cash"],
    datasets: [
      {
        data: salesByPayment.length > 0 
          ? salesByPayment.map((p) => p.totalAmount || 0)
          : [25, 30, 25, 20],
        backgroundColor: pieColors.slice(0, salesByPayment.length > 0 ? salesByPayment.length : 4),
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#637381",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 13,
          },
        },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#212B36",
        bodyColor: "#637381",
        borderColor: "#e0e0e0",
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: $${context.raw.toLocaleString()} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
        anchor: "center",
        align: "center",
      },
    },
  };

  // Stat cards configuration
  const statCards = [
    {
      label: "Total Sales",
      value: formatCurrency(stats?.totalSales),
      icon: <FaDollarSign />,
      color: "#667eea",
    },
    {
      label: "Total Transactions",
      value: stats?.totalTransactions || 0,
      icon: <FaChartBar />,
      color: "#ed64a6",
    },
    {
      label: "Total Products",
      value: stats?.totalProducts || 0,
      icon: <FaBox />,
      color: "#4fd1c5",
    },
    {
      label: "Total Customers",
      value: stats?.totalCustomers || 0,
      icon: <FaUsers />,
      color: "#f6ad55",
    },
  ];

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Dashboard</h1>
        <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px", color: "#667eea" }}>⟳</div>
          Loading dashboard data...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Dashboard</h1>

      {/* 4 Stats Cards */}
      <div style={styles.statsGrid}>
        {statCards.map((card, index) => (
          <div key={index} style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                backgroundColor: `${card.color}15`,
                color: card.color,
              }}
            >
              {card.icon}
            </div>
            <div style={styles.statLabel}>{card.label}</div>
            <div style={styles.statValue}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row - Sales & Payment Methods */}
      <div style={styles.chartsRow}>
        {/* Combined Bar + Line Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>Monthly Sales Overview</div>
          <div style={{ fontSize: "14px", color: "#00AB55", marginBottom: "16px", marginTop: "-12px" }}>
            {monthlySales.length > 0 
              ? `Total: $${monthlySales.reduce((sum, m) => sum + m.totalAmount, 0).toLocaleString()}`
              : "No sales data available"}
          </div>
          <div style={styles.chartContainer}>
            <Chart type="bar" data={combinedChartData} options={combinedChartOptions} />
          </div>
        </div>

        {/* Pie Chart - Sales by Payment Method */}
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>Sales by Payment Method</div>
          <div style={{ ...styles.chartContainer, height: "340px" }}>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
