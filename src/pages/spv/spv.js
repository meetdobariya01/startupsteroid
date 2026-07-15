import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaUserTie,
  FaChartLine,
  FaBuilding,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "./spv.css";
import Contactform from "../../components/contactform/contactform";

const features = [
  "Delaware LLC Formation",
  "Single & Multi-Asset SPVs",
  "Accredited Investor",
  "Deal Syndication",
  "10-Year Lifecycle Managed",
  "24 × 7 Expert Support",
];
const featuress = [
  {
    title: "Fast Execution",
    description: "SPVs launched in as little as 1 business day.",
  },
  {
    title: "Human Support",
    description: "Real experts available whenever you need guidance.",
  },
  {
    title: "Flexible Structuring",
    description: "Customized SPV setups built around your deal needs.",
  },
  {
    title: "Investor-Friendly Experience",
    description: "Simple onboarding with wire, ACH, and auto-debit support.",
  },
];
const cards = [
  {
    title: "SPV Formation & Administration",
    description:
      "Form and manage SPVs with confidence, from legal setup to ongoing compliance and investor support.",
    list: [
      "Create and manage venture investment SPVs with confidence",
      "Delaware Series formation",
      "SAFE, convertible note & equity investments",
      "Blue Sky filing coordination",
      "Investor onboarding",
      "KYC / AML support",
      "Capital call management",
      "Tax coordination and K-1 administration",
    ],
  },
  {
    title: "Fund Management",
    description:
      "Operate institutional-quality funds without building a large back-office team.",
    list: [
      "LP onboarding & management",
      "Subscription tracking",
      "Capital calls & distributions",
      "Fund accounting support",
      "Investor reporting",
      "Document management",
      "Performance tracking",
    ],
  },
  {
    title: "Built for Emerging Managers",
    description:
      "SPV Hub was designed specifically for the next generation of fund managers and investment communities.",
    list: [
      "Angel Networks",
      "Syndicates",
      "Rolling Funds",
      "Micro VCs",
      "Scout Funds",
      "Venture Studios",
      "Operator-Led Funds",
      "Family Offices",
      "Investment Clubs",
      "Corporate Venture Programs",
    ],
  },
];
const cardss = [
  {
    icon: <FaUserTie />,
    title: "Angel Investors & Syndicate Leads",
    description:
      "Run fast, deal-by-deal raises without administrative burden. SPVs help consolidate accredited investors while maintaining focus on quality investments.",
  },
  {
    icon: <FaChartLine />,
    title: "Emerging Fund Managers Raising Deal-by-Deal",
    description:
      "Validate your thesis and build your reputation before launching a full fund. Manage each investment independently while maintaining professional compliance.",
  },
  {
    icon: <FaBuilding />,
    title: "Founders Who Want a Clean Cap Table",
    description:
      "Consolidate dozens of checks into one line. SPVs simplify governance, reduce legal noise, and keep investors organized.",
  },
  {
    icon: <FaUsers />,
    title: "Family Offices & Multi-Asset Investors",
    description:
      "Channel funds into selected investments through a flexible investment architecture designed for transparency and long-term portfolio management.",
  },
];

const Spv = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      <section className="hero-section">
        <Container>
          <motion.span
            className="hero-badge"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            DELAWARE SPV FORMATION
          </motion.span>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Launch, Manage & Scale Investment
            <br />
            Vehicles with Confidence
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            SPV Hub is a modern platform for angel groups, syndicates, venture
            funds, family offices and emerging fund managers to create
            institutional-grade SPVs, manage their funds, investors, and report
            on their portfolios.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Button className="btn-primary-custom">Book a Demo</Button>

            <Button variant="outline-light" className="btn-outline-custom">
              See How It Works
            </Button>
          </motion.div>

          <motion.div
            className="feature-pill"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
          >
            {features.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="spv-section">
        <Container>
          <div className="spv-wrapper">
            <Row className="align-items-center g-5">
              {/* Left Side */}

              <Col lg={5}>
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <span className="small-title">BUILT FOR SPVS</span>

                  <h2>
                    Scaling Investment
                    <br />
                    Operations with
                    <br />
                    SPV Hub
                  </h2>
                </motion.div>
              </Col>

              {/* Right Side */}

              <Col lg={7}>
                <Row className="g-4">
                  {featuress.map((item, index) => (
                    <Col md={6} key={index}>
                      <motion.div
                        className="feature-box"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.15,
                        }}
                        viewport={{ once: true }}
                      >
                        <h4>{item.title}</h4>

                        <p>{item.description}</p>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      <section className="investment-section">
        <Container>
          <motion.div
            className="investment-heading"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Everything You Need to Launch and Manage Investment Vehicles
          </motion.div>

          <Row className="g-4 mt-3">
            {cards.map((card, index) => (
              <Col lg={4} md={6} key={index}>
                <motion.div
                  className="investment-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                  }}
                  viewport={{ once: true }}
                >
                  <h3>{card.title}</h3>

                  <p>{card.description}</p>

                  <hr />

                  <ul>
                    {card.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="spv-cycle-section">
        <Container>
          <motion.div
            className="section-header-spv text-center"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="small-heading">WHO IT'S BUILT FOR</span>

            <h2>SPVs Work Across Every Stage of the Fundraising Cycle</h2>

            <p>
              SPVs (Special Purpose Vehicles) and SPEs (Special Purpose
              Entities) help pool multiple investors into a single legal entity,
              simplifying cap tables and streamlining investment management.
              <br />
              <br />
              SPV Hub is built for investors, syndicates and organizations
              seeking a faster, more efficient way to raise capital and manage
              private investments.
            </p>
          </motion.div>

          <Row className="g-4 mt-5">
            {cardss.map((item, index) => (
              <Col lg={6} key={index}>
                <motion.div
                  className="cycle-card"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                  }}
                  viewport={{ once: true }}
                >
                  <div className="icon-circle">{item.icon}</div>

                  <h4>{item.title}</h4>

                  <p>{item.description}</p>
                  {/* 
                  <a href="/">
                    Learn more
                    <FaArrowRight className="ms-2" />
                  </a> */}
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* contact form */}
      <Contactform />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Spv;
