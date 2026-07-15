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
      </Routes>
    </Router>
  </ThemeProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
