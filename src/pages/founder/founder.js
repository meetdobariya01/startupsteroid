import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaLinkedinIn,
  FaLightbulb,
  FaRocket,
  FaHandshake,
  FaChartLine,
  FaUsers,
  FaBullseye,
  FaBrain,
  FaBuilding,
  FaQuoteLeft,
  FaStar,
  FaGlobe,
  FaLock,
} from "react-icons/fa6";
import "./founder.css";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import { createOrder, verifyPayment } from "../../services/paymentService";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const initiatives = [
  {
    icon: <FaHandshake />,
    number: "01",
    title: "Matchmaking",
    description:
      "Connecting startups with the right investors, mentors, partners, and ecosystem opportunities.",
  },
  {
    icon: <FaChartLine />,
    number: "02",
    title: "GTM Guru",
    description:
      "Helping startups build effective go-to-market strategies and reach the right customers.",
  },
  {
    icon: <FaBullseye />,
    number: "03",
    title: "Deal Flow",
    description:
      "Creating structured opportunities for startups to connect with investors and funding networks.",
  },
  {
    icon: <FaUsers />,
    number: "04",
    title: "Demo Day",
    description:
      "Giving emerging founders a platform to showcase their ideas, products, and business potential.",
  },
  {
    icon: <FaBrain />,
    number: "05",
    title: "ReadyScore AI",
    description:
      "Supporting startup readiness through structured insights and data-driven evaluation.",
  },
  {
    icon: <FaBuilding />,
    number: "06",
    title: "SPV Creation",
    description:
      "Exploring structured investment opportunities that help connect capital with promising ventures.",
  },
];

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Founder = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  const handlePayment = async () => {
    setError("");
    setLoading(true);

    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load Razorpay. Check your network.");

      // 2. Create order on backend
      const order = await createOrder();

      // 3. Open Razorpay checkout
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Startup Steroid",
        description: "Registration / Program Fee",
        order_id: order.orderId,
        image: "/logo.png", // optional
        handler: async (response) => {
          try {
            const result = await verifyPayment(response);
            if (result.success) {
              navigate("https://form.startupsteroids.in/login", {
                state: {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  amount: order.amount / 100,
                },
              });
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
        notes: { product: "Startup Steroid Program" },
        theme: { color: "#f97316" },
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
      <Header />

      <main className="ss-founder-page">
        {/* HERO SECTION (unchanged) */}
        <section className="ss-hero">
          <div className="ss-hero-grid"></div>
          <div className="ss-glow ss-glow-one"></div>
          <div className="ss-glow ss-glow-two"></div>

          <Container className="ss-container">
            <Row className="align-items-center">
              <Col lg={9} xl={8}>
                <motion.div initial="hidden" animate="visible" variants={stagger}>
                  <motion.div variants={fadeUp} className="ss-eyebrow">
                    <span className="ss-eyebrow-line"></span>
                    THE PEOPLE BEHIND THE VISION
                  </motion.div>

                  <motion.h1 variants={fadeUp} className="ss-hero-title">
                    Building the future
                    <br />
                    of <span>entrepreneurship.</span>
                  </motion.h1>

                  <motion.p variants={fadeUp} className="ss-hero-description">
                    Every great ecosystem begins with a belief. At Startup
                    Steroid, our founders are driven by the belief that
                    ambitious entrepreneurs deserve access to the right
                    connections, knowledge, and opportunities.
                  </motion.p>
                </motion.div>
              </Col>

              <Col lg={3} xl={4}>
                <motion.div
                  className="ss-hero-symbol"
                  initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  <div className="ss-symbol-ring ss-ring-one"></div>
                  <div className="ss-symbol-ring ss-ring-two"></div>
                  <div className="ss-symbol-center">
                    <FaRocket />
                  </div>
                  <span className="ss-symbol-dot ss-dot-one"></span>
                  <span className="ss-symbol-dot ss-dot-two"></span>
                  <span className="ss-symbol-dot ss-dot-three"></span>
                </motion.div>
              </Col>
            </Row>

            <motion.div
              className="ss-hero-bottom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span>VISION</span>
              <span className="ss-bottom-line"></span>
              <span>PEOPLE</span>
              <span className="ss-bottom-line"></span>
              <span>IMPACT</span>
            </motion.div>
          </Container>
        </section>

        {/* VISION SECTION */}
        <section className="ss-section ss-vision-section" id="our-vision">
          <Container className="ss-container">
            <Row className="align-items-center g-5">
              <Col lg={5}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <div className="ss-eyebrow">
                    <span className="ss-eyebrow-line"></span>
                    WHY WE STARTED
                  </div>
                  <h2 className="ss-section-title">
                    Great ideas deserve
                    <br />
                    <span>the right ecosystem.</span>
                  </h2>
                </motion.div>
              </Col>

              <Col lg={7}>
                <motion.div
                  className="ss-vision-content"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <FaQuoteLeft className="ss-quote-icon" />
                  <p className="ss-vision-quote">
                    Entrepreneurship should not be a journey where founders have
                    to figure out everything alone. The right connections and
                    guidance can change the trajectory of a business.
                  </p>
                  <p className="ss-vision-text">
                    Startup Steroid is built around this belief. We aim to
                    bridge the gaps between ideas, execution, expertise, and
                    capital by creating meaningful connections across the
                    startup ecosystem.
                  </p>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* INITIATIVES SECTION */}
        <section className="ss-section ss-initiatives-section">
          <Container className="ss-container">
            <motion.div
              className="ss-section-heading"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="ss-eyebrow">
                <span className="ss-eyebrow-line"></span>
                WHAT WE ARE BUILDING
              </div>
              <h2>
                Turning vision into
                <br />
                <span>real opportunities.</span>
              </h2>
              <p>
                A connected ecosystem of initiatives designed to support
                founders at different stages of their entrepreneurial journey.
              </p>
            </motion.div>

            <Row className="g-4">
              {initiatives.map((item) => (
                <Col md={6} lg={4} key={item.number}>
                  <motion.div
                    className="ss-initiative-card"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={fadeUp}
                    whileHover={{ y: -8 }}
                  >
                    <div className="ss-initiative-top">
                      <div className="ss-initiative-icon">{item.icon}</div>
                      <span>{item.number}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="ss-initiative-line"></div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* PHILOSOPHY */}
        <section className="ss-section ss-philosophy-section">
          <Container className="ss-container">
            <motion.div
              className="ss-philosophy-box"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="ss-philosophy-icon">
                <FaLightbulb />
              </div>
              <div className="ss-philosophy-content">
                <div className="ss-eyebrow">OUR PHILOSOPHY</div>
                <h2>
                  We don't just support startups.
                  <br />
                  <span>We believe in their potential.</span>
                </h2>
                <p>
                  We believe that meaningful progress happens when founders,
                  investors, mentors, and innovators come together with a shared
                  purpose. Our focus is on building relationships that create
                  lasting value.
                </p>
              </div>
              <FaStar className="ss-philosophy-decoration" />
            </motion.div>
          </Container>
        </section>

        {/* ECOSYSTEM */}
        <section className="ss-section ss-ecosystem-section">
          <Container className="ss-container">
            <motion.div
              className="ss-section-heading"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="ss-eyebrow">
                <span className="ss-eyebrow-line"></span>
                THE BIGGER PICTURE
              </div>
              <h2>
                Stronger together.
                <br />
                <span>Better for everyone.</span>
              </h2>
              <p>
                A thriving startup ecosystem is built through collaboration
                between every stakeholder.
              </p>
            </motion.div>

            <motion.div
              className="ss-ecosystem-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { icon: <FaRocket />, label: "Startups" },
                { icon: <FaChartLine />, label: "Investors" },
                { icon: <FaUsers />, label: "Mentors" },
                { icon: <FaGlobe />, label: "Ecosystem Partners" },
              ].map((item, index) => (
                <motion.div
                  className="ss-ecosystem-item"
                  variants={fadeUp}
                  key={item.label}
                >
                  <span className="ss-ecosystem-number">0{index + 1}</span>
                  <div className="ss-ecosystem-icon">{item.icon}</div>
                  <h3>{item.label}</h3>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* CTA / PAYMENT */}
        <section className="ss-cta-section">
          <Container className="ss-container">
            <motion.div
              className="ss-cta-box ss-payment-cta"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="ss-cta-decoration"></div>

              <div className="ss-eyebrow">
                <span className="ss-eyebrow-line"></span>
                INVEST IN YOUR NEXT BIG MOVE
              </div>

              <h2>
                Take the first step.
                <br />
                <span>Make it happen.</span>
              </h2>

              <p>
                Get started with our ecosystem and unlock new opportunities to
                grow, connect, and build something meaningful.
              </p>

              <div className="ss-payment-card">
                <span className="ss-price-label">
                  Registration / Program Fee
                </span>
                <h3>₹9,999</h3>
                <div className="ss-price-divider"></div>
                <div className="ss-price-row">
                  <span>Base Amount</span>
                  <strong>₹9,999</strong>
                </div>
                <div className="ss-price-row">
                  <span>GST (18%)</span>
                  <strong>₹1,799.82</strong>
                </div>
                <div className="ss-price-divider"></div>
                <div className="ss-price-row ss-total-row">
                  <span>Total Payable</span>
                  <strong>₹11,798.82</strong>
                </div>
                <small>Inclusive of 18% GST</small>
              </div>

              {error && <div className="ss-payment-error">⚠️ {error}</div>}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="ss-btn-primary"
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Processing…
                  </>
                ) : (
                  <>
                    Proceed to Payment <FaArrowRight />
                  </>
                )}
              </button>

              <div className="ss-payment-note">
                <FaLock style={{ marginRight: 6 }} />
                Secure Payment · Transparent Pricing
              </div>
            </motion.div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Founder;