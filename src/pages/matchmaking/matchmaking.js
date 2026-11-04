import { useEffect, useState } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Container, Row, Col, Card, Badge, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCheck, FaBolt, FaFileAlt, FaComments } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import "./matchmaking.css";
import Contactform from "../../components/contactform/contactform";
import { createOrder, verifyPayment } from "../../services/paymentService";

const benefits = [
  {
    title: "Investor-Ready Profiles",
    text: "Review opportunities through a consistent, structured format.",
  },
  {
    title: "Readiness Insights",
    text: "See which startups are prepared before scheduling meetings.",
  },
  {
    title: "Centralized Documents",
    text: "Access decks and supporting files in one secure workspace.",
  },
  {
    title: "Faster Decisions",
    text: "Spend more time evaluating and less time chasing information.",
  },
];

const features = [
  {
    icon: <FaUserCheck />,
    title: "Focus on founders who are truly prepared",
  },
  {
    icon: <FaBolt />,
    title: "Make better decisions faster",
  },
  {
    icon: <FaFileAlt />,
    title: "Access investor-ready materials in one place",
  },
  {
    icon: <FaComments />,
    title: "Reduce unnecessary back-and-forth",
  },
];

// Razorpay Script Loader
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Matchmaking = () => {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  const handlePayment = async () => {
    setError("");
    setLoading(true);

    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load Razorpay. Check your network.");

      // 2. Create order on backend (Passing the exact amount for this page: 47,198.82)
      const order = await createOrder(4719882); // 47,198.82 in paise

      // 3. Open Razorpay checkout
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Startup Steroid",
        description: "Premium Investor Access",
        order_id: order.orderId,
        image: "/logo.png",
        handler: async (response) => {
          try {
            const result = await verifyPayment(response);
            if (result.success) {
              // Redirect to the external form after successful verification
              window.location.href = `https://form.startupsteroids.in/login?paymentId=${response.razorpay_payment_id}`;
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            setError("Verification error. If money was deducted, contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        notes: { product: "Investor Access" },
        theme: { color: "#f97316" }, // Matches your accent color
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (resp) => {
        setError(resp.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.message || "Could not initiate payment.");
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <Header />

      <section className="investor-section py-5">
        <Container>
          <div className="text-center mb-5">
            <Badge bg="light" text="dark" pill className="px-4 py-2 shadow-sm">
              Investors
            </Badge>

            <motion.h2
              className="display-5 fw-bold mt-4 text-light"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Built for Investors Who Value{" "}
              <span className="accent">Prepared Founders</span>
            </motion.h2>

            <p className="lead text-light mt-3">
              Connect with startups that are organized, transparent, and ready
              to engage.
            </p>
          </div>

          <Row className="g-4">
            <motion.h2
              className="display-6 fw-bold mt-5 text-center text-light"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              What You Get
            </motion.h2>
            {benefits.map((item, i) => (
              <Col md={6} lg={3} key={item.title}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="benefit-card h-100 shadow-sm text-center">
                    <Card.Body className="p-4">
                      <div className="icon-box-matchmaking mx-auto mb-3">
                        <FiFileText />
                      </div>
                      <h5 className="fw-bold">{item.title}</h5>
                      <p className="mb-0">{item.text}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="why-section">
        <Container>
          <motion.div
            className="text-center mb-5"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="why-title text-white">
              Why Angels Use <span>InvestorConnect365</span>
            </h2>

            <p className="why-subtitle">
              Finding quality startups can be time-consuming. With structured
              profiles and verified data you can:
            </p>
          </motion.div>

          <Row className="align-items-center gy-5">
            {/* Left Side */}
            <Col lg={5}>
              <motion.div
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9 }}
                viewport={{ once: true }}
                className="startup-wrapper"
              >
                <div className="circle-bg"></div>

                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="startup"
                  className="startup-img"
                />

                <div className="floating-dot dot1"></div>
                <div className="floating-dot dot2"></div>
                <div className="floating-dot dot3"></div>
              </motion.div>
            </Col>

            {/* Right Side */}
            <Col lg={7}>
              {features.map((item, index) => (
                <motion.div
                  key={index}
                  className="feature-card"
                  initial={{ opacity: 0, x: 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                  }}
                  viewport={{ once: true }}
                >
                  <div className="icon-box-matchmaking2">{item.icon}</div>
                  <h5>{item.title}</h5>
                </motion.div>
              ))}
            </Col>
          </Row>
        </Container>
      </section>

      <section className="cta-section">
        <Container>
          <motion.div
            className="cta-box payment-cta-box"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Animated Background Circles */}
            <span className="shape shape1"></span>
            <span className="shape shape2"></span>
            <span className="shape shape3"></span>

            <div className="payment-cta-content">
              <span className="payment-badge">PREMIUM INVESTOR ACCESS</span>

              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                Invest in Opportunities.
                <br />
                <span>Be Part of the Future.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                Unlock exclusive investor access, discover promising startups,
                connect with founders, and become part of a growing innovation
                ecosystem.
              </motion.p>

              <motion.div
                className="payment-price-card"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <div className="payment-price-heading">
                  <span>Investment / Registration Fee</span>
                  <h3>₹39,999</h3>
                </div>

                <div className="payment-price-row">
                  <span>Base Amount</span>
                  <strong>₹39,999.00</strong>
                </div>

                <div className="payment-price-row">
                  <span>GST (18%)</span>
                  <strong>₹7,199.82</strong>
                </div>

                <div className="payment-total-row">
                  <span>Total Payable</span>
                  <strong>₹47,198.82</strong>
                </div>

                <small>Inclusive of 18% GST</small>
              </motion.div>

              {/* ERROR MESSAGE */}
              {error && <div className="ss-payment-error" style={{ color: '#ff4d4f', marginBottom: '15px', fontWeight: 'bold' }}>⚠️ {error}</div>}

              {/* PAYMENT BUTTON */}
              <motion.button
                onClick={handlePayment}
                disabled={loading}
                className="cta-btn text-decoration-none border-0"
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                whileHover={{ scale: loading ? 1 : 1.05, y: loading ? 0 : -4 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Processing…
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </motion.button>

              <div className="payment-secure-note">
                🔒 Secure Payment &nbsp; | &nbsp; Transparent Pricing
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Contact Form */}
      <Contactform />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Matchmaking;