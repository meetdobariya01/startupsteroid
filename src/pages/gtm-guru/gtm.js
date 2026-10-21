import React from "react";
import { motion } from "framer-motion";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  FaArrowDown,
  FaArrowRight,
  FaStar,
  FaBullseye,
  FaCog,
  FaChartLine,
  FaHandshake,
  FaRocket,
  FaChartBar,
  FaLaptop,
  // FaChartBar,
  FaShoppingBag,
  // FaCog,
} from "react-icons/fa";
import "./gtm.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Contactform from "../../components/contactform/contactform";

const stats = [
  { value: "40+", label: "Brands Launched" },
  { value: "3x", label: "Avg. Revenue Lift" },
  { value: "90", label: "Days to Market" },
  { value: "4.9", label: "Client Satisfaction", star: true },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};
const features = [
  {
    icon: <FaBullseye />,
    title: "Strategy-First Approach",
    description: "Define ICP, positioning, pricing before spending.",
  },
  {
    icon: <FaCog />,
    title: "Tech-Enabled Execution",
    description: "CRM, automation, analytics dashboards setup.",
  },
  {
    icon: <FaChartLine />,
    title: "Measurable Growth",
    description: "Campaigns optimized for ROI and scaling.",
  },
];
const businessStages = [
  {
    icon: <FaLaptop />,
    category: "SAAS",
    title: "SaaS Companies",
    description: "From product-led growth to enterprise sales motions.",
    features: [
      "ICP definition & segmentation",
      "Freemium funnel setup",
      "SEO & inbound engine",
      "Outbound SDR automation",
      "Onboarding flow optimization",
    ],
  },
  {
    icon: <FaChartBar />,
    category: "MSME",
    title: "MSMEs & SMBs",
    description: "Small businesses deserve big-brand GTM firepower.",
    features: [
      "Digital presence setup",
      "Local & regional strategy",
      "Sales CRM implementation",
      "Paid media campaigns",
      "WhatsApp automation",
    ],
  },
  {
    icon: <FaShoppingBag />,
    category: "D2C",
    title: "D2C Brands",
    description: "Build strong customer relationships and scale fast.",
    features: [
      "Brand positioning",
      "DTC store optimization",
      "Performance marketing",
      "Influencer growth",
      "Marketplace launch",
    ],
  },
  {
    icon: <FaCog />,
    category: "MANUFACTURERS",
    title: "Manufacturers & OEMs",
    description: "Modern scalable sales engine for manufacturers.",
    features: [
      "Export strategy",
      "B2B lead generation",
      "Digital catalog setup",
      "Distributor networks",
      "OEM partnerships",
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

const orbitItems = [
  { icon: <FaHandshake />, className: "orbit-icon-one" },
  { icon: <FaBullseye />, className: "orbit-icon-two" },
  { icon: <FaChartBar />, className: "orbit-icon-three" },
  { icon: <FaRocket />, className: "orbit-icon-four" },
];

// const containerVariants = {
//   hidden: {},
//   visible: {
//     transition: { staggerChildren: 0.18 },
//   },
// };

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};
const pricingPlans = [
  {
    label: "STARTER",
    title: "GTM Launchpad",
    description:
      "For early-stage businesses and new product launches needing a solid strategy foundation.",
    price: "₹49K",
    suffix: "/project",
    features: [
      "GTM Audit & ICP Definition",
      "Market & Competitor Analysis",
      "90-Day GTM Roadmap",
      "Brand Positioning Document",
      "Channel Recommendation Report",
      "2 Strategy Sessions",
    ],
    button: "Get Started",
    popular: false,
    type: "starter",
  },
  {
    label: "GROWTH",
    title: "GTM Execute",
    description:
      "For businesses ready to move from planning to active market execution and customer acquisition.",
    price: "₹1.2L",
    suffix: "/month",
    features: [
      "Everything in Launchpad",
      "CRM Setup & Automation",
      "Performance Marketing Management",
      "Content & SEO Program",
      "Outbound Sales Playbook",
      "Weekly Growth Reviews",
      "Landing Page & Funnel Builds",
      "Dedicated GTM Strategist",
    ],
    button: "Claim This Plan",
    popular: true,
    type: "growth",
  },
  {
    label: "ENTERPRISE",
    title: "GTM Command",
    description:
      "For scaling companies that need a fully embedded GTM team across multiple products or markets.",
    price: "Let’s Talk",
    suffix: "",
    features: [
      "Everything in GTM Execute",
      "Multi-channel & Multi-market",
      "Sales Team Training & Enablement",
      "Product-Market Fit Sprints",
      "Partnership & Alliance Strategy",
      "Investor-ready Metrics Dashboard",
      "Embedded GTM Team Access",
    ],
    button: "Schedule Call",
    popular: false,
    type: "enterprise",
  },
];

const Gtm = () => {
  const handlePlanClick = (plan) => {
    // Replace these URLs with your actual contact or checkout routes.
    if (plan.type === "enterprise") {
      window.location.href = "/contact";
    } else {
      window.location.href = `/contact?plan=${plan.type}`;
    }
  };

  return (
    <div>
      {/* Header Section */}
      <Header />

      <section className="gtm-hero" id="home">
        <div className="gtm-grid-bg" />
        <div className="gtm-glow gtm-glow-left" />
        <div className="gtm-glow gtm-glow-right" />

        <div className="container position-relative">
          <motion.div
            className="row justify-content-center text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="col-12">
              <motion.div className="gtm-heading" variants={itemVariants}>
                <span className="gtm-title-line">GTM</span>
                <span className="gtm-title-line">GURU</span>
              </motion.div>
            </div>

            <motion.div className="col-lg-9 col-xl-8" variants={itemVariants}>
              <p className="gtm-description">
                Go-To-Market as a Service - built for SaaS, MSMEs, D2C brands,
                and Manufacturers ready to launch smarter, scale faster, and win
                markets decisively.
              </p>
            </motion.div>

            <motion.div className="col-12" variants={itemVariants}>
              <div className="gtm-actions d-flex justify-content-center align-items-center flex-wrap gap-3">
                <motion.a
                  href="#contact"
                  className="btn gtm-btn-primary"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Book a Free GTM Audit
                  <FaArrowRight className="ms-2 gtm-btn-icon" />
                </motion.a>

                <motion.a
                  href="#services"
                  className="btn gtm-btn-outline"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Explore Services
                  <FaArrowDown className="ms-2 gtm-btn-icon" />
                </motion.a>
              </div>
            </motion.div>

            <motion.div className="col-12" variants={itemVariants}>
              <div className="row gtm-stats justify-content-center">
                {stats.map((stat, index) => (
                  <motion.div
                    className="col-3 col-md-3 col-lg-3 gtm-stat-item"
                    key={stat.label}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.8 + index * 0.15,
                    }}
                  >
                    <div className="gtm-stat-card">
                      <h3 className="gtm-stat-value">
                        {stat.value}
                        {stat.star && <FaStar className="gtm-star" />}
                      </h3>
                      <p className="gtm-stat-label">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="gtm-scroll-indicator"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          aria-hidden="true"
        >
          <span />
        </motion.div>
      </section>

      <section className="gtm-about-section" id="about">
        <div className="gtm-about-grid" />

        <div className="container gtm-about-container">
          <div className="row align-items-center gy-5">
            {/* LEFT CONTENT */}
            <motion.div
              className="col-lg-6 gtm-about-content"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.span className="gtm-eyebrow" variants={fadeUp}>
                WHAT IS GTM GURU?
              </motion.span>

              <motion.h2 className="gtm-about-title" variants={fadeUp}>
                Your end-to-end
                <br className="d-none d-xl-block" /> Go-To-Market
                <br className="d-none d-xl-block" /> engine
              </motion.h2>

              <motion.p className="gtm-about-description" variants={fadeUp}>
                GTM Guru is Startup Steroid' dedicated market-entry and growth
                service - combining strategy, technology, and execution to get
                you to your customers fast and profitably.
              </motion.p>

              <div className="gtm-feature-list">
                {features.map((feature, index) => (
                  <motion.div
                    className="gtm-feature-item"
                    key={feature.title}
                    variants={fadeUp}
                    whileHover={{ x: 7 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="gtm-feature-icon">{feature.icon}</div>

                    <div className="gtm-feature-text">
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT ORBITAL ILLUSTRATION */}
            <motion.div
              className="col-lg-6"
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="gtm-orbit-visual">
                <div className="gtm-orbit orbit-outer" />
                <div className="gtm-orbit orbit-inner" />

                <motion.div
                  className="gtm-orbit-center"
                  animate={{
                    boxShadow: [
                      "0 0 25px rgba(151, 64, 220, 0.16)",
                      "0 0 48px rgba(209, 45, 190, 0.30)",
                      "0 0 25px rgba(151, 64, 220, 0.16)",
                    ],
                  }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                >
                  <span>GTM</span>
                  <span>GURU</span>
                </motion.div>

                <motion.div
                  className="gtm-orbit-rotator"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 24,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {orbitItems.map((item, index) => (
                    <div
                      className={`gtm-orbit-position orbit-position-${index + 1}`}
                      key={item.className}
                    >
                      <motion.div
                        className={`gtm-orbit-icon ${item.className}`}
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 24,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        {item.icon}
                      </motion.div>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  className="gtm-orbit-caption"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="gtm-caption-dot" />
                  Strategy. Execution. Growth.
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="business-stages-section" id="business-stages">
        <div className="business-stages-bg" />

        <div className="container business-stages-container">
          {/* Section heading */}
          <motion.div
            className="business-stages-heading text-center"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="business-stages-eyebrow">WHO WE HELP</span>

            <h2>
              Built for every business
              <br className="d-none d-sm-block" /> stage and model
            </h2>

            <p>
              Whether you're launching a product, entering a new market, or
              scaling distribution - GTM Guru has a playbook for you.
            </p>
          </motion.div>

          {/* Business cards */}
          <motion.div
            className="row g-4 business-stages-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
          >
            {businessStages.map((business, index) => (
              <motion.div
                className="col-12 col-md-6 col-lg-3"
                key={business.category}
                variants={cardVariants}
              >
                <motion.article
                  className="business-stage-card"
                  whileHover={{
                    y: -7,
                    transition: { duration: 0.25 },
                  }}
                >
                  <div
                    className="business-stage-i
                  con"
                  >
                    {business.icon}
                  </div>

                  <span className="business-stage-badge">
                    {business.category}
                  </span>

                  <h3>{business.title}</h3>

                  <p className="business-stage-description">
                    {business.description}
                  </p>

                  <ul className="business-stage-features">
                    {business.features.map((feature, featureIndex) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: 0.12 * featureIndex,
                        }}
                        viewport={{ once: true }}
                      >
                        <span className="business-stage-bullet" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.article>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="pricing-section-gtm" id="pricing">
        <Container>
          <motion.div
            className="pricing-heading text-center"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <span className="pricing-eyebrow">PACKAGES</span>

            <h2>
              Transparent pricing.
              <br />
              No surprises.
            </h2>

            <p>
              Choose a plan that fits your stage, or talk to us for a custom
              engagement.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
          >
            <Row className="pricing-row g-4">
              {pricingPlans.map((plan) => (
                <Col
                  key={plan.type}
                  xs={12}
                  md={plan.popular ? 12 : 6}
                  lg={4}
                  className="pricing-column"
                >
                  <motion.div
                    variants={cardVariants}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.25 },
                    }}
                    className={`pricing-card ${
                      plan.popular ? "pricing-card-popular" : ""
                    }`}
                  >
                    {plan.popular && (
                      <span className="popular-badge">MOST POPULAR</span>
                    )}

                    <span className="plan-label">{plan.label}</span>

                    <h3 className="plan-title">{plan.title}</h3>

                    <p className="plan-description">{plan.description}</p>

                    <div className="plan-price">
                      <span>{plan.price}</span>
                      {plan.suffix && <small> {plan.suffix}</small>}
                    </div>

                    <ul className="plan-features">
                      {plan.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>

                    {/* <Button
                      type="button"
                      className={`plan-button ${
                        plan.popular ? "plan-button-primary" : ""
                      }`}
                      onClick={() => handlePlanClick(plan)}
                    >
                      {plan.button}
                      <span className="button-arrow" aria-hidden="true">
                        →
                      </span>
                    </Button> */}
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Contact Section */}
      <Contactform />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Gtm;
