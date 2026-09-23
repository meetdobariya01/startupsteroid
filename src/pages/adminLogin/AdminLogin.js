import React, { useState } from "react";
import { Container, Card, Form } from "react-bootstrap";
import { FaUserShield, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/auth/login`,
        { email: formData.username, password: formData.password }
      );

      if (!data.success) throw new Error(data.message || "Login failed");

      if (data.user.role !== "admin") {
        setError("Access denied. Admin credentials required.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        padding: 20,
      }}
    >
      <Container style={{ maxWidth: 440 }}>
        <Card
          className="border-0 shadow-lg"
          style={{ borderRadius: 16, padding: 8 }}
        >
          <div className="p-4">
            <div className="text-center mb-4">
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <FaUserShield size={36} color="#fff" />
              </div>
              <h3 style={{ fontWeight: 700, color: "#0f172a" }}>Admin Login</h3>
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 0 }}>
                Authorized personnel only
              </p>
            </div>

            {error && (
              <div
                className="alert alert-danger py-2"
                style={{ fontSize: 14, borderRadius: 8 }}
              >
                {error}
                <button
                  type="button"
                  className="btn-close float-end"
                  onClick={() => setError("")}
                ></button>
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 position-relative">
                <FaUserShield
                  className="field-icon"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 14,
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    zIndex: 2,
                  }}
                />
                <Form.Control
                  className="ps-5"
                  style={{
                    height: 48,
                    borderRadius: 10,
                    borderColor: "#e2e8f0",
                  }}
                  type="email"
                  name="username"
                  placeholder="Admin email"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4 position-relative">
                <FaLock
                  className="field-icon"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 14,
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    zIndex: 2,
                  }}
                />
                <Form.Control
                  className="ps-5 pe-5"
                  style={{
                    height: 48,
                    borderRadius: 10,
                    borderColor: "#e2e8f0",
                  }}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <span
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  style={{ cursor: "pointer", color: "#94a3b8", zIndex: 2 }}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </Form.Group>

              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={loading}
                style={{
                  height: 48,
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="text-center mt-3 mb-0" style={{ fontSize: 14 }}>
                <Link
                  to="/login"
                  className="text-decoration-none"
                  style={{ color: "#3b82f6", fontWeight: 500 }}
                >
                  ← Back to user login
                </Link>
              </p>
            </Form>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default AdminLogin;