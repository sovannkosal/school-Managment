// import React, { useEffect, useMemo, useState } from "react";
// import request from "../utils/request";
// import { showAlert } from "../utils/alert";

// const SalesPage = () => {
//   const [sales, setSales] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [perPage, setPerPage] = useState(10);
//   const [page, setPage] = useState(1);
//   const [selectedSale, setSelectedSale] = useState(null);

//   useEffect(() => {
//     fetchSales();
//   }, []);

//   const fetchSales = async () => {
//     setLoading(true);
//     try {
//       const response = await request("api/sale", "GET");
//       if (response.success) {
//         setSales(response.data || []);
//       } else {
//         showAlert("error", response.message || "Unable to load sales history");
//       }
//     } catch (error) {
//       console.error("Sales fetch error:", error);
//       showAlert("error", "Unable to load sales history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatCurrency = (value) => {
//     const amount = Number(value || 0);
//     return amount.toLocaleString(undefined, {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 2,
//     });
//   };

//   const getPhotoUrl = (photo) => {
//     if (!photo) return null;
//     return photo.startsWith("http") ? photo : `http://localhost:3000/${photo}`;
//   };

//   const filteredSales = useMemo(() => {
//     return sales.filter((sale) => {
//       const paymentLabel = sale.PaymentMethod?.type || sale.tbl_payment_method?.type || sale.pay_method;
//       const searchTarget = [sale.invoice_id, sale.sale_id, paymentLabel].join(' ').toLowerCase();
//       const matchesSearch = search.trim()
//         ? searchTarget.includes(search.toLowerCase())
//         : true;

//       const saleDate = sale.sale_date ? new Date(sale.sale_date) : null;
//       const matchesFrom = fromDate ? saleDate >= new Date(fromDate) : true;
//       const matchesTo = toDate ? saleDate <= new Date(toDate) : true;

//       return matchesSearch && matchesFrom && matchesTo;
//     });
//   }, [sales, search, fromDate, toDate]);

//   const salesSummary = useMemo(() => {
//     const totalSales = filteredSales.reduce((sum, sale) => sum + Number(sale.amount || 0), 0);
//     const avgOrder = filteredSales.length ? totalSales / filteredSales.length : 0;
//     const totalItems = filteredSales.reduce(
//       (sum, sale) => {
//         const items = sale.SaleItemDetails || sale.tbl_sale_item_details || [];
//         return sum + (items.reduce((itemSum, item) => itemSum + Number(item.qty || 0), 0) || 0);
//       },
//       0
//     );
//     return { totalSales, avgOrder, totalItems };
//   }, [filteredSales]);

//   const pageCount = Math.max(1, Math.ceil(filteredSales.length / perPage));
//   const displayedSales = filteredSales.slice((page - 1) * perPage, page * perPage);

//   const deleteSale = async (sale_id) => {
//     const confirmDelete = window.confirm("Delete this sale? This cannot be undone.");
//     if (!confirmDelete) return;

//     try {
//       const response = await request(`api/sale/${sale_id}`, "DELETE");
//       if (response.success) {
//         showAlert("success", "Sale deleted successfully");
//         setSales((prev) => prev.filter((sale) => sale.sale_id !== sale_id));
//       } else {
//         showAlert("error", response.message || "Unable to delete sale");
//       }
//     } catch (error) {
//       console.error("Delete sale error:", error);
//       showAlert("error", "Unable to delete sale");
//     }
//   };

//   const exportCSV = () => {
//     const headers = ["ID", "Invoice", "Date", "Payment", "Items", "Qty", "Price", "Total", "Image"];
//     const rows = filteredSales.map((sale) => {
//       const items = sale.SaleItemDetails || sale.tbl_sale_item_details || [];
//       const itemCount = items.length;
//       const quantity = items.reduce((sum, item) => sum + Number(item.qty || 0), 0) || 0;
//       const firstImage = getPhotoUrl(items[0]?.MasterProduct?.photo || items[0]?.tbl_master_product?.photo || items[0]?.photo);
//       return [
//         sale.sale_id,
//         sale.invoice_id || sale.sale_id,
//         sale.sale_date ? new Date(sale.sale_date).toLocaleDateString() : "",
//         sale.PaymentMethod?.type || sale.tbl_payment_method?.type || sale.pay_method || "",
//         itemCount,
//         quantity,
//         sale.sub_total || 0,
//         sale.amount || 0,
//         firstImage || "",
//       ];
//     });
//     const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "sales-history.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const printPage = () => {
//     window.print();
//   };

//   const printStyles = `
//     @media print {
//       body * {
//         visibility: hidden;
//       }
//       .sales-page-print-area, .sales-page-print-area * {
//         visibility: visible;
//       }
//       .sales-page-print-area {
//         position: absolute;
//         left: 0;
//         top: 0;
//         width: 100%;
//         background: white;
//       }
//       .no-print {
//         display: none !important;
//       }
//       table {
//         width: 100% !important;
//         border-collapse: collapse;
//       }
//       th, td {
//         border: 1px solid #cbd5e1 !important;
//         padding: 10px !important;
//       }
//     }
//   `;

//   return (
//     <div className="page-container" style={{ padding: 24, minHeight: "100vh" }}>
//       <style>{printStyles}</style>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
//         <div>
//           <h1 style={{ margin: 0, fontSize: 28 }}>Sales History</h1>
//           <p style={{ color: "#64748b", marginTop: 8 }}>Review and manage all transactional records across your enterprise.</p>
//         </div>

//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//           <button
//             type="button"
//             onClick={exportCSV}
//             style={{ borderRadius: 10, padding: "10px 18px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a", cursor: "pointer" }}
//           >
//             Export CSV
//           </button>
//           <button
//             type="button"
//             onClick={printPage}
//             style={{ borderRadius: 10, padding: "10px 18px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a", cursor: "pointer" }}
//           >
//             Print PDF
//           </button>
//         </div>
//       </div>

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 24 }}>
//         <div style={{ padding: 20, borderRadius: 18, background: "white", boxShadow: "0 4px 20px rgba(15, 23, 42, 0.05)" }}>
//           <span style={{ display: "block", color: "#475569", marginBottom: 8 }}>Total Sales</span>
//           <strong style={{ fontSize: 28 }}>{formatCurrency(salesSummary.totalSales)}</strong>
//         </div>
//         <div style={{ padding: 20, borderRadius: 18, background: "white", boxShadow: "0 4px 20px rgba(15, 23, 42, 0.05)" }}>
//           <span style={{ display: "block", color: "#475569", marginBottom: 8 }}>Avg Order Value</span>
//           <strong style={{ fontSize: 28 }}>{formatCurrency(salesSummary.avgOrder)}</strong>
//         </div>
//         <div style={{ padding: 20, borderRadius: 18, background: "white", boxShadow: "0 4px 20px rgba(15, 23, 42, 0.05)" }}>
//           <span style={{ display: "block", color: "#475569", marginBottom: 8 }}>Total Items Sold</span>
//           <strong style={{ fontSize: 28 }}>{salesSummary.totalItems}</strong>
//         </div>
//       </div>

//       <div style={{ padding: 20, borderRadius: 18, background: "white", boxShadow: "0 4px 20px rgba(15, 23, 42, 0.05)", marginTop: 24 }}>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
//           <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
//             <label style={{ fontWeight: 600 }}>Show</label>
//             <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1" }}>
//               {[10, 20, 50].map((n) => (
//                 <option key={n} value={n}>{n} per page</option>
//               ))}
//             </select>
//             <span style={{ color: "#64748b" }}>From</span>
//             <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1" }} />
//             <span style={{ color: "#64748b" }}>To</span>
//             <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1" }} />
//           </div>
//           <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
//             <label htmlFor="sales-search" style={{ fontWeight: 600 }}>Search Sale History:</label>
//             <input
//               id="sales-search"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search by invoice, payment or sale ID..."
//               style={{ minWidth: 240, padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1" }}
//             />
//           </div>
//         </div>
//       </div>

//       <div style={{ overflowX: "auto", marginTop: 24, borderRadius: 18, background: "white", boxShadow: "0 4px 20px rgba(15, 23, 42, 0.05)" }}>
//         <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
//           <thead style={{ background: "#10b981", color: "white" }}>
//             <tr>
//               <th style={tableHeaderStyle}>ID</th>
//               <th style={tableHeaderStyle}>Invoice</th>
//               <th style={tableHeaderStyle}>Payment</th>
//               <th style={tableHeaderStyle}>Items</th>
//               <th style={tableHeaderStyle}>Qty</th>
//               <th style={tableHeaderStyle}>Price</th>
//               <th style={tableHeaderStyle}>Total</th>
//               <th style={tableHeaderStyle}>Date</th>
//               <th style={tableHeaderStyle}>Image</th>
//               <th style={tableHeaderStyle}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={10} style={tableCellStyleCenter}>Loading sales history...</td>
//               </tr>
//             ) : displayedSales.length === 0 ? (
//               <tr>
//                 <td colSpan={10} style={tableCellStyleCenter}>No sales found.</td>
//               </tr>
//             ) : (
//               displayedSales.map((sale) => {
//                 const items = sale.SaleItemDetails || sale.tbl_sale_item_details || [];
//                 const quantity = items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
//                 const saleDate = sale.sale_date ? new Date(sale.sale_date).toLocaleDateString() : "-";
//                 const paymentType = sale.PaymentMethod?.type || sale.tbl_payment_method?.type || sale.pay_method || "Unknown";

//                 const productPhoto = getPhotoUrl(items[0]?.MasterProduct?.photo || items[0]?.tbl_master_product?.photo || items[0]?.photo);
//                 return (
//                   <React.Fragment key={sale.sale_id}>
//                     <tr>
//                       <td style={tableCellStyle}>{sale.sale_id}</td>
//                       <td style={tableCellStyle}>{sale.invoice_id || sale.sale_id}</td>
//                       <td style={tableCellStyle}>{paymentType}</td>
//                       <td style={tableCellStyle}>{items.length}</td>
//                       <td style={tableCellStyle}>{quantity}</td>
//                       <td style={tableCellStyle}>{formatCurrency(sale.sub_total)}</td>
//                       <td style={tableCellStyle}>{formatCurrency(sale.amount)}</td>
//                       <td style={tableCellStyle}>{saleDate}</td>
//                       <td style={tableCellStyle}>
//                         {productPhoto ? (
//                           <img src={productPhoto} alt="Sale item" style={{ width: 50, height: 40, objectFit: "cover", borderRadius: 8 }} />
//                         ) : (
//                           <span style={{ color: "#64748b" }}>No image</span>
//                         )}
//                       </td>
//                       <td style={tableCellStyle}>
//                         <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//                           <button
//                             type="button"
//                             onClick={() => setSelectedSale(sale)}
//                             style={actionButtonStyle}
//                           >
//                             View
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => deleteSale(sale.sale_id)}
//                             style={{ ...actionButtonStyle, background: "#ef4444" }}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   </React.Fragment>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {pageCount > 1 && (
//         <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
//           <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={paginationButtonStyle}>
//             Previous
//           </button>
//           <span style={{ alignSelf: "center" }}>
//             Page {page} of {pageCount}
//           </span>
//           <button onClick={() => setPage(Math.min(pageCount, page + 1))} disabled={page === pageCount} style={paginationButtonStyle}>
//             Next
//           </button>
//         </div>
//       )}

//       {selectedSale && (
//         <div className="sales-page-print-area" style={modalOverlayStyle} onClick={() => setSelectedSale(null)}>
//           <div style={modalContentStyle} onClick={(event) => event.stopPropagation()}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//               <div>
//                 <h2 style={{ margin: 0, fontSize: 22 }}>Sale Detail</h2>
//                 <p style={{ margin: '8px 0 0', color: '#64748b' }}>Sale Information</p>
//               </div>
//               <button onClick={() => setSelectedSale(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 24, color: '#475569' }}>
//                 ×
//               </button>
//             </div>

//             <div style={sectionCardStyle}>
//               <div style={sectionHeaderStyle}>Sale Information</div>
//               <table style={infoTableStyle}>
//                 <thead>
//                   <tr>
//                     <th style={infoHeaderCellStyle}>ID</th>
//                     <th style={infoHeaderCellStyle}>Invoice</th>
//                     <th style={infoHeaderCellStyle}>Total</th>
//                     <th style={infoHeaderCellStyle}>Tax</th>
//                     <th style={infoHeaderCellStyle}>Payment</th>
//                     <th style={infoHeaderCellStyle}>User</th>
//                     <th style={infoHeaderCellStyle}>Created At</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td style={infoCellStyle}>{selectedSale.sale_id}</td>
//                     <td style={infoCellStyle}>{selectedSale.invoice_id || selectedSale.sale_id}</td>
//                     <td style={infoCellStyle}>{formatCurrency(selectedSale.amount)}</td>
//                     <td style={infoCellStyle}>{formatCurrency(selectedSale.tax || 0)}</td>
//                     <td style={infoCellStyle}>{selectedSale.PaymentMethod?.type || selectedSale.tbl_payment_method?.type || selectedSale.pay_method || 'Unknown'}</td>
//                     <td style={infoCellStyle}>{selectedSale.create_by || 'Unknown'}</td>
//                     <td style={infoCellStyle}>{selectedSale.created_on ? new Date(selectedSale.created_on).toLocaleString() : '-'}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>

//             <div style={sectionCardStyle}>
//               <div style={sectionHeaderStyle}>Sale Items</div>
//               <table style={infoTableStyle}>
//                 <thead>
//                   <tr>
//                     <th style={infoHeaderCellStyle}>Product ID</th>
//                     <th style={infoHeaderCellStyle}>Quantity</th>
//                     <th style={infoHeaderCellStyle}>Price</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {((selectedSale.SaleItemDetails || selectedSale.tbl_sale_item_details) || []).map((item) => (
//                     <tr key={item.std_id}>
//                       <td style={infoCellStyle}>{item.prd_id}</td>
//                       <td style={infoCellStyle}>{item.qty}</td>
//                       <td style={infoCellStyle}>{formatCurrency(item.price)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div style={sectionCardStyle}>
//               <div style={sectionHeaderStyle}>Product Details</div>
//               {(() => {
//                 const item = (selectedSale.SaleItemDetails || selectedSale.tbl_sale_item_details || [])[0];
//                 const product = item?.MasterProduct || item?.tbl_master_product || item || {};
//                 const image = getPhotoUrl(product?.photo || item?.photo);
//                 return (
//                   <table style={infoTableStyle}>
//                     <thead>
//                       <tr>
//                         <th style={infoHeaderCellStyle}>Name</th>
//                         <th style={infoHeaderCellStyle}>Description</th>
//                         <th style={infoHeaderCellStyle}>Image</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td style={infoCellStyle}>{product?.prd_name || product?.name || 'No name'}</td>
//                         <td style={infoCellStyle}>{product?.remark || product?.description || 'No description'}</td>
//                         <td style={infoCellStyle}>{image ? <img src={image} alt="Product" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 12 }} /> : 'No image'}</td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 );
//               })()}
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }} className="no-print">
//               <button
//                 type="button"
//                 onClick={printPage}
//                 style={{ borderRadius: 10, padding: '10px 18px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}
//               >
//                 Print PDF
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const tableHeaderStyle = {
//   padding: 10,
//   textAlign: "left",
//   fontSize: 14,
//   letterSpacing: "0.01em",
// };

// const tableCellStyle = {
//   padding: 10,
//   borderBottom: "1px solid #e2e8f0",
//   verticalAlign: "middle",
// };

// const tableCellStyleCenter = {
//   padding: 24,
//   textAlign: "center",
//   color: "#64748b",
// };

// const actionButtonStyle = {
//   borderRadius: 8,
//   padding: "8px 14px",
//   background: "#f59e0b",
//   color: "white",
//   border: "none",
//   cursor: "pointer",
// };

// const paginationButtonStyle = {
//   borderRadius: 8,
//   padding: "8px 14px",
//   border: "1px solid #cbd5e1",
//   background: "white",
//   cursor: "pointer",
// };

// const sectionCardStyle = {
//   background: '#f8fafc',
//   border: '1px solid #e2e8f0',
//   borderRadius: 16,
//   padding: 18,
//   marginBottom: 18,
// };

// const sectionHeaderStyle = {
//   marginBottom: 14,
//   fontWeight: 700,
//   color: '#0f172a',
//   borderBottom: '1px solid #e2e8f0',
//   paddingBottom: 8,
// };

// const infoTableStyle = {
//   width: '100%',
//   borderCollapse: 'collapse',
//   fontSize: 14,
// };

// const infoHeaderCellStyle = {
//   padding: '10px 12px',
//   textAlign: 'left',
//   background: '#f1f5f9',
//   color: '#334155',
//   fontWeight: 700,
//   borderBottom: '1px solid #cbd5e1',
// };

// const infoCellStyle = {
//   padding: '12px',
//   color: '#475569',
//   borderBottom: '1px solid #e2e8f0',
// };

// const modalOverlayStyle = {
//   position: 'fixed',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: 'rgba(15, 23, 42, 0.55)',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   padding: 24,
//   zIndex: 1000,
// };

// const modalContentStyle = {
//   width: '100%',
//   maxWidth: 900,
//   background: 'white',
//   borderRadius: 22,
//   padding: 28,
//   boxShadow: '0 30px 80px rgba(15, 23, 42, 0.18)',
//   maxHeight: '90vh',
//   overflowY: 'auto',
// };

// export default SalesPage;
