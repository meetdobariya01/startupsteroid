import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/homepage/home";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Assessed from "./pages/assessed/assessed";
import Documation from "./pages/documation/documation";
import Matchmaking from "./pages/matchmaking/matchmaking";
import Dealflow from "./pages/dealflow/dealflow";
import Readyscore from "./pages/readyscore/readyscore";
import Spv from "./pages/spv/spv";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import AdminDashboard from "./components/AdminRoute/AdminDashboard";
import AdminLogin from "./pages/adminLogin/AdminLogin";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/assessed" element={<Assessed />} />
        <Route path="/documation" element={<Documation />} />
        <Route path="/matchmaking" element={<Matchmaking />} />
        <Route path="/dealflow" element={<Dealflow />} />
        <Route path="/readyscore" element={<Readyscore />} />
        <Route path="/spv" element={<Spv />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* ✅ /admin/* covers /admin, /admin/users, /admin/verification, etc. */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  </ThemeProvider>,
);

reportWebVitals();