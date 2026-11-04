import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { FaGoogle, FaEye, FaEyeSlash, FaArrowRight, FaPlus } from "react-icons/fa";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./login.css";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";

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
  const profileSuccess = searchParams.get("profile") === "success";

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
      const target = user.isProfileComplete ? "/dashboard" : "/form";
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
      const target = user.isProfileComplete ? "/dashboard" : "/form";
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const isLocked = lockoutSeconds > 0;

  return (
    <div>
      <Header />
      <main className="ss-login-page">
        <div className="ss-login-orb ss-login-orb-one" />
        <div className="ss-login-orb ss-login-orb-two" />

        <section className="ss-login-shell">
          <aside className="ss-login-showcase">
            <div className="ss-showcase-top">
              <span className="ss-eyebrow"><span /> BUILT FOR AMBITIOUS FOUNDERS</span>
              <h1>Big ideas deserve<br /><em>bold beginnings.</em></h1>
              <p>Your next chapter starts here. Connect with opportunities, move your ideas forward, and build something meaningful.</p>
            </div>

            <div className="ss-visual-stage" aria-hidden="true">
              <div className="ss-visual-grid" />
              <div className="ss-orbit ss-orbit-outer" />
              <div className="ss-orbit ss-orbit-inner" />
              <div className="ss-visual-core">
                <div className="ss-core-mark"><FaPlus /></div>
                <span>IDEA</span>
                <strong>→ IMPACT</strong>
              </div>
              <div className="ss-float-card ss-float-card-top">
                <span className="ss-float-icon">↗</span>
                <div><small>YOUR NEXT MOVE</small><b>Starts today</b></div>
              </div>
              <div className="ss-float-card ss-float-card-bottom">
                <span className="ss-mini-bars"><i /><i /><i /><i /></span>
                <div><small>GROWTH MINDSET</small><b>Think beyond limits</b></div>
              </div>
              <span className="ss-stage-star ss-star-one">✳</span>
              <span className="ss-stage-star ss-star-two">✦</span>
            </div>

            <div className="ss-showcase-footer">
              <span>01 — 03</span>
              <span className="ss-footer-line" />
              <span>IDEATE. BUILD. SCALE.</span>
            </div>
          </aside>

          <section className="ss-login-panel">
            <div className="ss-panel-heading">
              <span className="ss-panel-kicker">WELCOME BACK</span>
              <h2>Good to see<br />you <span>again.</span></h2>
              <p>Sign in to continue your journey.</p>
            </div>

            {(signupSuccess || profileSuccess) && (
              <div className="ss-alert ss-alert-success" role="status">
                <span>✓</span>
                {profileSuccess ? "Profile completed successfully! Please log in to continue." : "Account created successfully! Please log in."}
              </div>
            )}

            <form className="ss-login-form" onSubmit={handleSubmit} noValidate>
              <label className="ss-field-label" htmlFor="login-email">Email address</label>
              <div className="ss-field">
                <FiMail className="ss-field-icon" />
                <input id="login-email" type="email" placeholder="name@company.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading || isLocked} />
              </div>

              <div className="ss-password-label-row">
                <label className="ss-field-label" htmlFor="login-password">Password</label>
                <Link to="/forgot-password" className="ss-forgot-link">Forgot password?</Link>
              </div>
              <div className="ss-field">
                <FiLock className="ss-field-icon" />
                <input id="login-password" type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading || isLocked} />
                <button type="button" className="ss-password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {(error || isLocked) && (
                <div className="ss-alert ss-alert-error" role="alert">
                  {isLocked ? `Account locked. Try again in ${formatTime(lockoutSeconds)}.` : error}
                </div>
              )}

              <button type="submit" className="ss-submit-button" disabled={loading || !email || !password || isLocked}>
                <span>{isLocked ? `Locked (${formatTime(lockoutSeconds)})` : loading ? "Signing you in..." : "Sign in to your account"}</span>
                {!loading && !isLocked && <FaArrowRight />}
                {loading && <span className="ss-button-spinner" />}
              </button>
            </form>

            <div className="ss-separator">
              <span /> <small>OR CONTINUE WITH</small> <span />
            </div>

            <div className="ss-google-wrap">
              {/* ✅ FIX: Shows a clear alert if the ENV variable is missing */}
              {GOOGLE_CLIENT_ID ? (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google sign-in was cancelled or blocked by your browser.")}
                  theme="filled_black"
                  size="large"
                  width="320"
                  text="continue_with"
                  shape="rectangular"
                  logo_alignment="left"
                />
              ) : (
                <div style={{ color: "#dc2626", fontSize: "0.85rem", textAlign: "center", background: "#450a0a", padding: "10px", borderRadius: "8px" }}>
                  ⚠️ <strong>Google Login Disabled:</strong> <br />
                  `REACT_APP_GOOGLE_CLIENT_ID` is missing in your `.env` file.
                </div>
              )}
            </div>

            <p className="ss-signup-copy">
              New to Startup Steroid?{" "}
              <Link to="/signup">Create an account <span>↗</span></Link>
            </p>
            <div className="ss-panel-bottom">
              <span>© {new Date().getFullYear()} Startup Steroid</span>
              <span>Secure founder access</span>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const Login = () => {
  if (!GOOGLE_CLIENT_ID) {
    console.warn("REACT_APP_GOOGLE_CLIENT_ID is not set");
    return <LoginForm />;
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
};

export default Login;