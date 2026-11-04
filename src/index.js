import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";     // ← NEW

import Home from "./pages/homepage/home";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Assessed from "./pages/assessed/assessed";
import Documation from "./pages/documation/documation";
import Matchmaking from "./pages/matchmaking/matchmaking";
import Dealflow from "./pages/dealflow/dealflow";
import Readyscore from "./pages/readyscore/readyscore";
import Spv from "./pages/spv/spv";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import Gtm from "./pages/gtm-guru/gtm";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import Demoday from "./pages/demoday/demoday";
import Founder from "./pages/founder/founder";
import StartupApplicationForm from "./pages/form/form";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <Router>
      <AuthProvider>                    {/* ← NEW — inside Router */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/assessed" element={<Assessed />} />
          <Route path="/documation" element={<Documation />} />
          <Route path="/investors" element={<Matchmaking />} />
          <Route path="/dealflow" element={<Dealflow />} />
          <Route path="/readyscore" element={<Readyscore />} />
          <Route path="/spv" element={<Spv />} />
          <Route path="/gtm-guru" element={<Gtm />} />
          <Route path="/demoday" element={<Demoday />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/form" element={<StartupApplicationForm />} />
          {/* Admin login — public, must come before /admin/* */}
          <Route path="/admin/login" element={<AdminLogin />} />
    
          {/* Admin area — protected */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  </ThemeProvider>,
);

reportWebVitals();