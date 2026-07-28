import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "./admin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email.trim()) {
      setError("Please enter your email or username");
      setLoading(false);
      return;
    }
    if (!formData.password) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password
        }
      );

      if (response.data.success) {
        const user = response.data.user;
        
        // Check if user is admin
        if (user.role !== 'admin') {
          setError("Access denied. Admin privileges required.");
          setLoading(false);
          return;
        }

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Redirect to admin dashboard
        navigate("/admin");
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      if (error.response) {
        setError(error.response.data.message || "Login failed");
      } else if (error.request) {
        setError("Cannot connect to server. Please check your connection.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />

      <div className="admin-login-page d-flex align-items-center">
        <Container>
          <Card className="admin-login-card overflow-hidden border-0 shadow-lg">
            <Row className="g-0">
              <Col lg={6} className="admin-left-panel d-none d-lg-flex">
                <motion.div
                  className="text-center text-white p-5"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <FaShieldAlt size={80} className="mb-4" />
                  <h1>Admin Portal</h1>
                  <p>Secure access to manage documents and users</p>
                  <div className="admin-shield">🔒</div>
                </motion.div>
              </Col>

              <Col lg={6}>
                <div className="p-5">
                  <h3 className="text-center mb-4">
                    <FaShieldAlt className="me-2 text-primary" />
                    Admin Login
                  </h3>

                  {error && (
                    <Alert variant="danger" onClose={() => setError("")} dismissible>
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 position-relative">
                      <FaUser className="field-icon" />
                      <Form.Control 
                        placeholder="Email or Username"
                        className="ps-5"
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
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

                    <button 
                      type="submit" 
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Logging in...
                        </>
                      ) : (
                        "Login as Admin"
                      )}
                    </button>

                    <p className="text-center mt-3">
                      <a href="/login" className="text-decoration-none">
                        ← Back to User Login
                      </a>
                    </p>
                  </Form>
                </div>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLogin;