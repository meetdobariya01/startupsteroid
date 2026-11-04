import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { FaGoogle, FaEye, FaEyeSlash, FaPlus } from "react-icons/fa";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./login.css";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, googleLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(() => searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const signupSuccess = searchParams.get("signup") === "success";
  const profileSuccess = searchParams.get("profile") === "success";  // ✅ NEW

  useEffect(() => {
    if (lockoutSeconds <= 0) return;

    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setError("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      const target = user.isProfileComplete ? "/dashboard" : "/form";  // ✅ routes by profile status
      navigate(target, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      const lockUntil = err.response?.data?.lockUntil;

      if (status === 423 && lockUntil) {
        const remainingMs = new Date(lockUntil).getTime() - Date.now();
        const remainingSecs = Math.max(0, Math.floor(remainingMs / 1000));
        setLockoutSeconds(remainingSecs);
      } else if (status === 423) {
        setLockoutSeconds(15 * 60);
        setError(msg || "Account locked. Try again later.");
      } else if (status === 429) {
        setLockoutSeconds(15 * 60);
        setError("Too many attempts. Please wait.");
      } else if (status === 401) {
        setError(msg || "Invalid email or password.");
      } else {
        setError(msg || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      const user = await googleLogin(credentialResponse.credential);
      const target = user.isProfileComplete ? "/dashboard" : "/form";  // ✅ routes by profile status
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const isLocked = lockoutSeconds > 0;

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="finotic-logo">
            <img src="/images/logo.png" alt="Startup Steroid" className="logo w-25" />
          </div>

          <div className="finance-illustration">
            <div className="balance-card finance-card">
              <div className="card-icon">
                <div className="wallet-shape"></div>
              </div>
              <span className="card-label">CURRENT BALANCE</span>
              <div className="balance">
                <span>$</span>24,359
              </div>
            </div>

            <div className="chart-card finance-card">
              <div className="donut-chart">
                <div className="donut-inner">
                  <strong>34%</strong>
                  <span>Food</span>
                </div>
              </div>
            </div>

            <div className="transaction-card finance-card">
              <div className="transaction-plus">
                <FaPlus />
              </div>
              <strong>New transaction</strong>
              <span>or upload .xls file</span>
            </div>
          </div>

          <div className="left-content">
            <h1>Welcome back!</h1>
            <p>Start managing your finance faster and better</p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-wrapper">
            <div className="login-heading">
              <h2>Welcome back!</h2>
              <p>Start managing your finance faster and better</p>
            </div>

            {/* ✅ Handles both signup and profile completion success */}
            {(signupSuccess || profileSuccess) && (
              <div
                role="status"
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  color: "#065f46",
                  padding: "10px 14px",
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: "0.9rem",
                }}
              >
                {profileSuccess
                  ? "✅ Profile completed successfully! Please log in to continue."
                  : "✅ Account created successfully! Please log in."}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="input-group-custom">
                <div className="input-icon">
                  <FiMail />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || isLocked}
                />
              </div>

              <div className="input-group-custom">
                <div className="input-icon">
                  <FiLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="current-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || isLocked}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {(error || isLocked) && (
                <div
                  className="login-error"
                  role="alert"
                  style={{
                    color: "#dc2626",
                    fontSize: "0.875rem",
                    marginTop: "-0.5rem",
                    marginBottom: "0.75rem",
                    fontWeight: isLocked ? "600" : "400",
                  }}
                >
                  {isLocked
                    ? `🔒 Account locked. Try again in ${formatTime(lockoutSeconds)}.`
                    : error}
                </div>
              )}

              <div className="forgot-wrapper">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading || !email || !password || isLocked}
              >
                {isLocked
                  ? `Locked (${formatTime(lockoutSeconds)})`
                  : loading
                  ? "Logging in…"
                  : "Login"}
              </button>
            </form>

            <div className="divider">
              <span></span>
              <p>or</p>
              <span></span>
            </div>

            <div
              className="social-login"
              style={{ display: "flex", justifyContent: "center" }}
            >
              {GOOGLE_CLIENT_ID ? (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google sign-in was cancelled.")}
                  theme="outline"
                  size="large"
                  width="320"
                  text="continue_with"
                  shape="rectangular"
                  logo_alignment="left"
                />
              ) : (
                <button
                  type="button"
                  className="social-button"
                  disabled
                  title="Google Client ID missing in .env"
                >
                  <FaGoogle className="google-icon" />
                  <span>Google (configure REACT_APP_GOOGLE_CLIENT_ID)</span>
                </button>
              )}
            </div>

            <div className="signup-text">
              Don't you have an account? <Link to="/signup"> SignUp</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  if (!GOOGLE_CLIENT_ID) {
    console.warn("⚠️ REACT_APP_GOOGLE_CLIENT_ID is not set");
    return <LoginForm />;
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
};

export default Login;