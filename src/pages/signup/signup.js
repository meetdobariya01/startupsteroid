import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import "./signup.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      {/* Header */}
      <Header />

      <div className="login-page d-flex align-items-center">
        <Container>
          <Card className="login-card overflow-hidden border-0 shadow-lg">
            <Row className="g-0">
              <Col lg={6}>
                <div className="p-5">
                  <h3 className="text-center mb-4">Create Account</h3>

                  <Form>
                    <Form.Group className="mb-3 position-relative">
                      <FaUser className="field-icon" />
                      <Form.Control placeholder="Username" className="ps-5" />
                    </Form.Group>

                    <Form.Group className="mb-3 position-relative">
                      <FaEnvelope className="field-icon" />
                      <Form.Control placeholder="Email" className="ps-5" />
                    </Form.Group>

                    <Form.Group className="mb-3 position-relative">
                      <FaPhone className="field-icon" />
                      <Form.Control placeholder="Mobile" className="ps-5" />
                    </Form.Group>

                    <Form.Group className="mb-3 position-relative">
                      <FaLock className="field-icon" />
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="ps-5 pe-5"
                      />
                      <span
                        className="position-absolute top-50 end-0 translate-middle-y me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </Form.Group>

                    <button type="button" class="btn btn-outline-dark w-100">
                      SignUp
                    </button>
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Signup;
