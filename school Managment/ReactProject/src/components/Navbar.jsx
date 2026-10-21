import React from "react";
import "../style/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>Dashboard</h2>
        </div>
        <ul className="navbar-menu">
          {/* <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/products">Products</a>
          </li>
          <li>
            <a href="/sales">Sales</a>
          </li>
          <li>
            <a href="/customers">Customers</a>
          </li>
          <li>
            <a href="/reports">Reports</a>
          </li> */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
