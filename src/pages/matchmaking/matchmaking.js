import React from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaUserCheck, FaBolt, FaFileAlt, FaComments } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import "./matchmaking.css";
import Contactform from "../../components/contactform/contactform";

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

const Matchmaking = () => {
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
                  <Card className="benefit-card h-100  shadow-sm text-center">
                    <Card.Body className="p-4">
                      <div className="icon-box-matchmaking mx-auto mb-3">
                        <FiFileText />
                      </div>
                      <h5 className="fw-bold">{item.title}</h5>
                      <p className=" mb-0">{item.text}</p>
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
            className="cta-box"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Animated Background Circles */}

            <span className="shape shape1"></span>
            <span className="shape shape2"></span>
            <span className="shape shape3"></span>

            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Start Engaging Smarter
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              Create your founder profile, check your readiness, and start
              sharing your startup with confidence.
            </motion.p>

            <motion.button
              className="cta-btn"
              whileHover={{
                scale: 1.05,
                y: -4,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              Apply as an Investor
            </motion.button>
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
