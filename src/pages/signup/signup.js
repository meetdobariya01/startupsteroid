// import React, { useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   InputGroup,
// } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
// import { useAuth } from "../../context/"; // adjust path if needed
// import "./signup.css";

// const Signup = () => {
//   const navigate = useNavigate();
//   const { signup } = useAuth();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setError("");
//   };

//   // Live password complexity check — matches backend validator
//   const passwordChecks = {
//     length: formData.password.length >= 8,
//     upper: /[A-Z]/.test(formData.password),
//     lower: /[a-z]/.test(formData.password),
//     number: /\d/.test(formData.password),
//     special: /[^A-Za-z0-9]/.test(formData.password),
//   };

//   const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

//   const validate = () => {
//     if (!formData.firstName.trim()) return "First name is required.";
//     if (!formData.lastName.trim()) return "Last name is required.";
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
//       return "Please enter a valid email address.";
//     if (passwordStrength < 5)
//       return "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.";
//     if (formData.password !== formData.confirmPassword)
//       return "Passwords do not match.";
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const validationError = validate();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setSubmitting(true);
//     try {
//       await signup({
//         firstName: formData.firstName.trim(),
//         lastName: formData.lastName.trim(),
//         email: formData.email.trim().toLowerCase(),
//         password: formData.password,
//       });

//       navigate("/dashboard", { replace: true });
//     } catch (err) {
//       const status = err.response?.status;
//       const msg = err.response?.data?.message;

//       if (status === 409)
//         setError("That email is already registered. Try logging in.");
//       else if (status === 429)
//         setError("Too many signup attempts. Please wait a moment.");
//       else if (status === 400)
//         setError(msg || "Please check the form and try again.");
//       else if (!err.response)
//         setError("Cannot reach server. Is the backend running?");
//       else setError(msg || "Signup failed. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const strengthColor =
//     passwordStrength <= 2
//       ? "#dc2626"
//       : passwordStrength <= 4
//       ? "#f59e0b"
//       : "#10b981";

//   return (
//     <div className="signup-page">
//       <Container fluid className="signup-container">
//         <Row className="min-vh-100 g-0">
//           {/* Left Side */}
//           <Col lg={6} className="signup-left d-none d-lg-flex">
//             <div className="signup-left-content">
//               <div className="brand-logo">{/* <span>STARTUP</span> */}</div>

//               <h1>
//                 Build your startup.
//                 <br />
//                 <span>Grow your vision.</span>
//               </h1>

//               <p>
//                 Create your account and get access to powerful tools designed to
//                 help you manage, grow and scale your startup.
//               </p>

//               <div className="signup-benefits">
//                 <div className="benefit-item">
//                   <span>✓</span>
//                   <p>Manage your startup profile</p>
//                 </div>
//                 <div className="benefit-item">
//                   <span>✓</span>
//                   <p>Connect with investors</p>
//                 </div>
//                 <div className="benefit-item">
//                   <span>✓</span>
//                   <p>Track your business growth</p>
//                 </div>
//               </div>
//             </div>
//           </Col>

//           {/* Right Side */}
//           <Col lg={6} className="signup-right">
//             <div className="signup-form-wrapper">
//               <div className="mobile-logo d-lg-none">STARTUP</div>

//               <div className="signup-header">
//                 <div className="signup-icon">
//                   <FaUserPlus />
//                 </div>
//                 <h2>Create your account</h2>
//                 <p>Join us and start building your startup journey.</p>
//               </div>

//               <Form onSubmit={handleSubmit} noValidate>
//                 {/* Names */}
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>First Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="firstName"
//                         placeholder="Enter first name"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         autoComplete="given-name"
//                         disabled={submitting}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>

//                   <Col md={6}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Last Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="lastName"
//                         placeholder="Enter last name"
//                         value={formData.lastName}
//                         onChange={handleChange}
//                         autoComplete="family-name"
//                         disabled={submitting}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 {/* Email */}
//                 <Form.Group className="mb-3">
//                   <Form.Label>Email Address</Form.Label>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     placeholder="you@example.com"
//                     value={formData.email}
//                     onChange={handleChange}
//                     autoComplete="email"
//                     disabled={submitting}
//                     required
//                   />
//                 </Form.Group>

//                 {/* Password */}
//                 <Form.Group className="mb-2">
//                   <Form.Label>Password</Form.Label>
//                   <InputGroup>
//                     <Form.Control
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       placeholder="Create a password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       autoComplete="new-password"
//                       disabled={submitting}
//                       required
//                       minLength={8}
//                     />
//                     <Button
//                       variant="light"
//                       className="password-toggle"
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       tabIndex={-1}
//                     >
//                       {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </Button>
//                   </InputGroup>

//                   {/* Password strength meter */}
//                   {formData.password && (
//                     <div style={{ marginTop: 8 }}>
//                       <div
//                         style={{
//                           height: 4,
//                           borderRadius: 2,
//                           background: "#e5e7eb",
//                           overflow: "hidden",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: `${(passwordStrength / 5) * 100}%`,
//                             height: "100%",
//                             background: strengthColor,
//                             transition: "all 0.3s",
//                           }}
//                         />
//                       </div>

//                       <ul
//                         style={{
//                           listStyle: "none",
//                           padding: 0,
//                           margin: "8px 0 0",
//                           fontSize: "0.75rem",
//                           color: "#9ca3af",
//                           display: "flex",
//                           flexWrap: "wrap",
//                           gap: "0 12px",
//                         }}
//                       >
//                         <li
//                           style={{
//                             color: passwordChecks.length ? "#10b981" : undefined,
//                           }}
//                         >
//                           {passwordChecks.length ? "✓" : "○"} 8+ chars
//                         </li>
//                         <li
//                           style={{
//                             color: passwordChecks.upper ? "#10b981" : undefined,
//                           }}
//                         >
//                           {passwordChecks.upper ? "✓" : "○"} Uppercase
//                         </li>
//                         <li
//                           style={{
//                             color: passwordChecks.lower ? "#10b981" : undefined,
//                           }}
//                         >
//                           {passwordChecks.lower ? "✓" : "○"} Lowercase
//                         </li>
//                         <li
//                           style={{
//                             color: passwordChecks.number ? "#10b981" : undefined,
//                           }}
//                         >
//                           {passwordChecks.number ? "✓" : "○"} Number
//                         </li>
//                         <li
//                           style={{
//                             color: passwordChecks.special
//                               ? "#10b981"
//                               : undefined,
//                           }}
//                         >
//                           {passwordChecks.special ? "✓" : "○"} Special char
//                         </li>
//                       </ul>
//                     </div>
//                   )}
//                 </Form.Group>

//                 {/* Confirm Password */}
//                 <Form.Group className="mb-3">
//                   <Form.Label>Confirm Password</Form.Label>
//                   <InputGroup>
//                     <Form.Control
//                       type={showConfirmPassword ? "text" : "password"}
//                       name="confirmPassword"
//                       placeholder="Confirm your password"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       autoComplete="new-password"
//                       disabled={submitting}
//                       required
//                       className={
//                         formData.confirmPassword &&
//                         formData.password !== formData.confirmPassword
//                           ? "is-invalid"
//                           : ""
//                       }
//                     />
//                     <Button
//                       variant="light"
//                       className="password-toggle"
//                       type="button"
//                       onClick={() =>
//                         setShowConfirmPassword(!showConfirmPassword)
//                       }
//                       tabIndex={-1}
//                     >
//                       {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                     </Button>
//                   </InputGroup>

//                   {formData.confirmPassword &&
//                     formData.password !== formData.confirmPassword && (
//                       <div
//                         className="field-error"
//                         style={{
//                           color: "#dc2626",
//                           fontSize: "0.8rem",
//                           marginTop: 4,
//                         }}
//                       >
//                         Passwords do not match.
//                       </div>
//                     )}
//                 </Form.Group>

//                 {/* Terms */}
//                 <Form.Group className="mb-4">
//                   <Form.Check
//                     type="checkbox"
//                     id="terms"
//                     required
//                     disabled={submitting}
//                     label={
//                       <>
//                         I agree to the{" "}
//                         <Link to="#">Terms & Conditions</Link> and{" "}
//                         <Link to="#">Privacy Policy</Link>.
//                       </>
//                     }
//                   />
//                 </Form.Group>

//                 {/* Error banner */}
//                 {error && (
//                   <div
//                     role="alert"
//                     style={{
//                       background: "#fef2f2",
//                       border: "1px solid #fecaca",
//                       color: "#b91c1c",
//                       padding: "10px 14px",
//                       borderRadius: 8,
//                       marginBottom: 16,
//                       fontSize: "0.9rem",
//                     }}
//                   >
//                     {error}
//                   </div>
//                 )}

//                 {/* Submit */}
//                 <Button
//                   type="submit"
//                   className="signup-submit w-100"
//                   disabled={submitting}
//                 >
//                   {submitting ? "Creating account…" : "Create Account"}
//                 </Button>
//               </Form>

//               <div className="login-link">
//                 Already have an account? <Link to="/login">Sign In</Link>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./signup.css";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

const SignupForm = () => {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Live password complexity checks
  const passwordChecks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const validate = () => {
    if (!formData.firstName.trim()) return "First name is required.";
    if (!formData.lastName.trim()) return "Last name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Please enter a valid email address.";
    if (passwordStrength < 5)
      return "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match.";
    return null;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const validationError = validate();
  if (validationError) {
    setError(validationError);
    return;
  }

  setSubmitting(true);
  try {
    await signup({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    });

    // ✅ Straight to the profile form, already authenticated
    navigate("/login", { replace: true });
  } catch (err) {
    const status = err.response?.status;
    const msg = err.response?.data?.message;

    if (status === 409)
      setError("That email is already registered. Try logging in.");
    else if (status === 429)
      setError("Too many signup attempts. Please wait a moment.");
    else if (status === 400)
      setError(msg || "Please check the form and try again.");
    else if (!err.response)
      setError("Cannot reach server. Is the backend running?");
    else setError(msg || "Signup failed. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

const handleGoogleSuccess = async (credentialResponse) => {
  setError("");
  setSubmitting(true);
  try {
    const user = await googleLogin(credentialResponse.credential);
    const target = user.isProfileComplete ? "/dashboard" : "/login";
    navigate(target, { replace: true });
  } catch (err) {
    setError(err.response?.data?.message || "Google sign-up failed.");
  } finally {
    setSubmitting(false);
  }
};

  const strengthColor =
    passwordStrength <= 2
      ? "#dc2626"
      : passwordStrength <= 4
      ? "#f59e0b"
      : "#10b981";

  return (
    <div className="signup-page">
      <Container fluid className="signup-container">
        <Row className="min-vh-100 g-0">
          {/* Left Side */}
          <Col lg={6} className="signup-left d-none d-lg-flex">
            <div className="signup-left-content">
              <div className="brand-logo">{/* <span>STARTUP</span> */}</div>

              <h1>
                Build your startup.
                <br />
                <span>Grow your vision.</span>
              </h1>

              <p>
                Create your account and get access to powerful tools designed to
                help you manage, grow and scale your startup.
              </p>

              <div className="signup-benefits">
                <div className="benefit-item">
                  <span>✓</span>
                  <p>Manage your startup profile</p>
                </div>
                <div className="benefit-item">
                  <span>✓</span>
                  <p>Connect with investors</p>
                </div>
                <div className="benefit-item">
                  <span>✓</span>
                  <p>Track your business growth</p>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Side */}
          <Col lg={6} className="signup-right">
            <div className="signup-form-wrapper">
              <div className="mobile-logo d-lg-none">STARTUP</div>

              <div className="signup-header">
                <div className="signup-icon">
                  <FaUserPlus />
                </div>
                <h2>Create your account</h2>
                <p>Join us and start building your startup journey.</p>
              </div>

              <Form onSubmit={handleSubmit} noValidate>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        autoComplete="given-name"
                        disabled={submitting}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        autoComplete="family-name"
                        disabled={submitting}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    disabled={submitting}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      disabled={submitting}
                      required
                      minLength={8}
                    />
                    <Button
                      variant="light"
                      className="password-toggle"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>

                  {formData.password && (
                    <div style={{ marginTop: 8 }}>
                      <div
                        style={{
                          height: 4,
                          borderRadius: 2,
                          background: "#e5e7eb",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${(passwordStrength / 5) * 100}%`,
                            height: "100%",
                            background: strengthColor,
                            transition: "all 0.3s",
                          }}
                        />
                      </div>

                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: "8px 0 0",
                          fontSize: "0.75rem",
                          color: "#9ca3af",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0 12px",
                        }}
                      >
                        <li style={{ color: passwordChecks.length ? "#10b981" : undefined }}>
                          {passwordChecks.length ? "✓" : "○"} 8+ chars
                        </li>
                        <li style={{ color: passwordChecks.upper ? "#10b981" : undefined }}>
                          {passwordChecks.upper ? "✓" : "○"} Uppercase
                        </li>
                        <li style={{ color: passwordChecks.lower ? "#10b981" : undefined }}>
                          {passwordChecks.lower ? "✓" : "○"} Lowercase
                        </li>
                        <li style={{ color: passwordChecks.number ? "#10b981" : undefined }}>
                          {passwordChecks.number ? "✓" : "○"} Number
                        </li>
                        <li style={{ color: passwordChecks.special ? "#10b981" : undefined }}>
                          {passwordChecks.special ? "✓" : "○"} Special char
                        </li>
                      </ul>
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      disabled={submitting}
                      required
                      className={
                        formData.confirmPassword &&
                        formData.password !== formData.confirmPassword
                          ? "is-invalid"
                          : ""
                      }
                    />
                    <Button
                      variant="light"
                      className="password-toggle"
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>

                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <div
                        className="field-error"
                        style={{
                          color: "#dc2626",
                          fontSize: "0.8rem",
                          marginTop: 4,
                        }}
                      >
                        Passwords do not match.
                      </div>
                    )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    id="terms"
                    required
                    disabled={submitting}
                    label={
                      <>
                        I agree to the{" "}
                        <Link to="#">Terms & Conditions</Link> and{" "}
                        <Link to="#">Privacy Policy</Link>.
                      </>
                    }
                  />
                </Form.Group>

                {error && (
                  <div
                    role="alert"
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#b91c1c",
                      padding: "10px 14px",
                      borderRadius: 8,
                      marginBottom: 16,
                      fontSize: "0.9rem",
                    }}
                  >
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="signup-submit w-100"
                  disabled={submitting}
                >
                  {submitting ? "Creating account…" : "Create Account"}
                </Button>
              </Form>

              <div className="divider">
                <span></span>
                <p>or</p>
                <span></span>
              </div>

              {/* Google Sign-Up */}
              <div
                style={{ display: "flex", justifyContent: "center" }}
              >
                {GOOGLE_CLIENT_ID ? (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Google sign-up failed.")}
                    theme="outline"
                    size="large"
                    width="320"
                    text="signup_with"
                    shape="rectangular"
                    logo_alignment="left"
                  />
                ) : (
                  <button
                    type="button"
                    className="social-button"
                    disabled
                    title="Google Client ID missing"
                  >
                    Google (configure REACT_APP_GOOGLE_CLIENT_ID)
                  </button>
                )}
              </div>

              <div className="login-link">
                Already have an account? <Link to="/login">Sign In</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

// Wrapper — provides Google context only if client ID exists
const Signup = () => {
  if (!GOOGLE_CLIENT_ID) {
    console.warn("⚠️ REACT_APP_GOOGLE_CLIENT_ID is not set");
    return <SignupForm />;
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <SignupForm />
    </GoogleOAuthProvider>
  );
};

export default Signup;