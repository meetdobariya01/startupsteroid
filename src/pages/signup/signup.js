import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaRocket,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./signup.css";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";

const Signup = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Connect your existing signup API here.
      // Pass formData to your existing signup function.
      if (onSubmit) {
        await onSubmit({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      } else {
        console.log("Signup form data:", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <Header />

      <div className="signup-page">
        <div className="signup-bg-glow signup-glow-one"></div>
        <div className="signup-bg-glow signup-glow-two"></div>

        <div className="signup-container">
          {/* LEFT SIDE */}
          <motion.div
            className="signup-left"
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* <Link to="/" className="signup-brand">
            <span className="brand-icon">
              <FaRocket />
            </span>
            <span>
              STARTUP<span className="brand-highlight"> STEROID</span>
            </span>
          </Link> */}

            <div className="signup-left-content">
              <span className="signup-eyebrow">
                <span className="eyebrow-dot"></span>
                YOUR NEXT CHAPTER STARTS HERE
              </span>

              <h1>
                Build something
                <br />
                <span>extraordinary.</span>
              </h1>

              <p>
                Join a community of ambitious founders, innovators, and
                investors. Turn your vision into something bigger.
              </p>

              <div className="signup-benefits">
                <div>
                  <FaCheckCircle />
                  <span>Connect with startup founders</span>
                </div>
                <div>
                  <FaCheckCircle />
                  <span>Discover investment opportunities</span>
                </div>
                <div>
                  <FaCheckCircle />
                  <span>Grow your startup ecosystem</span>
                </div>
              </div>
            </div>

            <div className="signup-left-footer">
              © {new Date().getFullYear()} Startup Steroid. All rights reserved.
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            className="signup-right"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="signup-form-wrapper">
              <div className="signup-form-heading">
                <span className="signup-small-label">GET STARTED TODAY</span>
                <h2>Create your account</h2>
                <p>Enter your details to join the community.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="signup-field">
                  <label>Full Name</label>
                  <div className="signup-input-box">
                    <FaUser className="signup-input-icon" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="signup-field">
                  <label>Email Address</label>
                  <div className="signup-input-box">
                    <FaEnvelope className="signup-input-icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="signup-field">
                  <label>Password</label>
                  <div className="signup-input-box">
                    <FaLock className="signup-input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="signup-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <small className="signup-hint">Minimum 8 characters</small>
                </div>

                <div className="signup-field">
                  <label>Confirm Password</label>
                  <div className="signup-input-box">
                    <FaLock className="signup-input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="signup-eye-btn"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {error && <div className="signup-error">{error}</div>}

                <div className="signup-terms">
                  <span>
                    By creating an account, you agree to our{" "}
                    <Link to="#">Terms of Service</Link> and{" "}
                    <Link to="#">Privacy Policy</Link>.
                  </span>
                </div>

                <motion.button
                  type="submit"
                  className="signup-submit-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                  {!loading && <FaArrowRight />}
                </motion.button>
              </form>

              <div className="signup-login-link">
                Already have an account?
                <Link to="/login"> Sign In</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Signup;
