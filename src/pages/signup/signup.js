import React, { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "./signup.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // console.log('Sending request to:', `${API_URL}/api/auth/signup`);
      
      const response = await axios.post(
        `${API_URL}/api/auth/signup`,
        {
          username: formData.username,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }
      );

      // console.log('Response:', response.data);

      if (response.data.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        setFormData({
          username: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: ""
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error('Error details:', error);
      
      if (error.response) {
        console.log('Server error:', error.response.data);
        setError(error.response.data.message || "Signup failed");
      } else if (error.request) {
        console.log('No response from server');
        setError("Cannot connect to server. Please make sure the backend is running on port 5000.");
      } else {
        console.log('Other error:', error.message);
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />

      <div className="login-page d-flex align-items-center">
        <Container>
          <Card className="login-card overflow-hidden border-0 shadow-lg">
            <Row className="g-0">
              <Col lg={6}>
                <div className="p-5">
                  <h3 className="text-center mb-4">Create Account</h3>

                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      {error}
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setError("")}
                      ></button>
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                      {success}
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setSuccess("")}
                      ></button>
                    </div>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 position-relative">
                      <FaUser className="field-icon" />
                      <Form.Control 
                        placeholder="Username"
                        className="ps-5"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 position-relative">
                      <FaEnvelope className="field-icon" />
                      <Form.Control 
                        placeholder="Email"
                        className="ps-5"
                        type="text"  // Changed from "email" to "text" to match login
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 position-relative">
                      <FaPhone className="field-icon" />
                      <Form.Control 
                        placeholder="Mobile"
                        className="ps-5"
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        disabled={loading}
                        maxLength="10"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 position-relative">
                      <FaLock className="field-icon" />
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="ps-5 pe-5"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                      <span
                        className="position-absolute top-50 end-0 translate-middle-y me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </Form.Group>

                    <Form.Group className="mb-3 position-relative">
                      <FaLock className="field-icon" />
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="ps-5"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </Form.Group>

                    <button 
                      type="submit" 
                      className="btn btn-outline-dark w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        "SignUp"
                      )}
                    </button>

                    <p className="text-center mt-3">
                      Already have an account?{" "}
                      <NavLink
                        to="/login"
                        className="text-decoration-none text-danger"
                      >
                        Login
                      </NavLink>
                    </p>
                  </Form>
                </div>
              </Col>
              <Col lg={6} className="left-panel d-none d-lg-flex">
                <motion.div
                  className="text-center text-white p-5"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <h1>Launch Your Startup</h1>
                  <p>Build, connect, and grow with confidence.</p>
                  <div className="rocket">🚀</div>
                </motion.div>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>

      <Footer />
    </div>
  );
};

export default Signup;