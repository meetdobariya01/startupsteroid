import { useEffect, useState } from "react";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import api from "./api/axios";
import AdminUsers from "./AdminUsers";
import AdminVerification from "./AdminVerification";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((r) => setStats(r.data.stats))
      .catch((e) =>
        console.error("Stats error:", e.response?.data || e.message)
      );
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/admin" && location.pathname.startsWith(path));

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <Link to="/admin" className={isActive("/admin") && location.pathname === "/admin" ? "active" : ""}>
            📊 Overview
          </Link>
          <Link to="/admin/users" className={isActive("/admin/users") ? "active" : ""}>
            👥 Users
          </Link>
          <Link to="/admin/verification" className={isActive("/admin/verification") ? "active" : ""}>
            ✅ Verification
          </Link>
        </nav>
        <button onClick={logout}>Logout</button>
      </aside>

      <main className="admin-main">
        {stats && (
          <div className="stats-grid">
            <Card label="Total Users" value={stats.totalUsers} />
            <Card label="Admins" value={stats.admins} />
            <Card label="Verified" value={stats.verified} />
            <Card label="Locked" value={stats.locked} />
          </div>
        )}

        <Routes>
          <Route index element={<p style={{ color: "#64748b" }}>Select a section from the sidebar…</p>} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="verification" element={<AdminVerification />} />
        </Routes>
      </main>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}