import React, { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "./login.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    setErrors({});
    setLoading(true);

    // Client-side validation
    if (!formData.username.trim()) {
      setError("Please enter username or email");
      setLoading(false);
      return;
    }
    if (!formData.password) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }

    try {
      console.log('📝 Sending login request:', {
        email: formData.username,
        password: '******'
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`,
        {
          email: formData.username,
          password: formData.password
        }
      );

      // console.log('✅ Login response:', response.data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (error.response) {
        // Server responded with error
        // console.log('📄 Error response:', error.response.data);
        
        if (error.response.data.errors) {
          // Validation errors
          const fieldErrors = {};
          error.response.data.errors.forEach(err => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
          setError("Please fix the errors below");
        } else {
          setError(error.response.data.message || "Login failed");
        }
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

      <div className="login-page d-flex align-items-center">
        <Container>
          <Card className="login-card overflow-hidden border-0 shadow-lg">
            <Row className="g-0">
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

              <Col lg={6}>
                <div className="p-5">
                  <h3 className="text-center mb-4">User Login</h3>

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

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 position-relative">
                      <FaUser className="field-icon" />
                      <Form.Control 
                        placeholder="Username or Email"
                        className="ps-5"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={loading}
                        isInvalid={!!errors.email}
                        required
                      />
                      {errors.email && (
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      )}
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
                        isInvalid={!!errors.password}
                        required
                      />
                      <span
                        className="position-absolute top-50 end-0 translate-middle-y me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                      {errors.password && (
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>

                    <button 
                      type="submit" 
                      className="btn btn-outline-dark w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </button>

                    <p className="text-center mt-3">
                      Don&apos;t have an account?{" "}
                      <NavLink
                        to="/signup"
                        className="text-decoration-none text-danger"
                      >
                        Create one
                      </NavLink>
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

export default Login;