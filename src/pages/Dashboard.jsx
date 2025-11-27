import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalProducts: 0,
    outOfStock: 0,
    totalQuantity: 0,
    totalSalesAmount: 0,
  });

  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/analytics/summary");
        setStats(res.data);
      } catch (err) {
        setError("Could not load dashboard stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      {}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="close-btn" onClick={() => setSidebarOpen(false)}>
          ×
        </div>

        <h3 className="sidebar-title">Menu</h3>

        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/products")}>View Products</button>
        <button onClick={() => navigate("/products/new")}>Add Product</button>
        <button onClick={() => navigate("/sales/new")}>Add Sale</button>

        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </aside>

      {}
      <div className="hamburger" onClick={() => setSidebarOpen(true)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {}
      <main className="dashboard-main">
        <h2 className="welcome-title">
          Welcome, {user?.username || user?.email}!
        </h2>

        {error && <div className="error">{error}</div>}

        {}
        <div className="stats-cards">
          <div className="card sales-total-card">
            <h3>Total Sales (₦)</h3>
            <p className="big-number">
              {stats.totalSalesAmount.toLocaleString()}
            </p>
          </div>

          <div className="card">
            <h3>Total Products</h3>
            <h3>{stats.totalProducts}</h3>
          </div>

          <div className="card">
            <h3>Out of Stock</h3>
            <h3>{stats.outOfStock}</h3>
          </div>

          <div className="card">
            <h3>Total Quantity</h3>
            <h3>{stats.totalQuantity}</h3>
          </div>
        </div>
      </main>
    </div>
  );
}
