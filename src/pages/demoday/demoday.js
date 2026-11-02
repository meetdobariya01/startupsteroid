import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaUsers,
  FaChartLine,
  FaAward,
  FaMousePointer,
  FaClock,
  FaRegEdit,
  FaThLarge,
  FaLightbulb,
  FaChess,
  FaExpandAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "./demoday.css";
import Contactform from "../../components/contactform/contactform";

const steps = [
  {
    number: "01",
    title: "Create",
    icon: <FaPlus />,
    description:
      "Organize your event, add pitch decks, and tailor your feedback surveys. Use special codes for every session so it is easy to find.",
  },
  {
    number: "02",
    title: "Engage",
    icon: <FaUsers />,
    description:
      "Share the event link, track presentations in real-time, and collect targeted feedback—no registration required.",
  },
  {
    number: "03",
    title: "Analyze",
    icon: <FaChartLine />,
    description:
      "See all the feedback right away, export answers, and look at performance to enhance next-level pitches and events.",
  },
];
const features = [
  {
    icon: <FaAward />,
    title: "Easy Step",
    description:
      "Create events with just a few clicks. Upload decks, schedule sessions, and invite participants—no tech headaches.",
  },
  {
    icon: <FaMousePointer />,
    title: "Join from Anywhere",
    description:
      "Fully compatible across devices. Participants can join with a simple email and event code—no downloads, no logins.",
  },
  {
    icon: <FaClock />,
    title: "Keep Things on Time",
    description:
      "Built-in timers help every presenter stay on track and every session run like clockwork.",
  },
  {
    icon: <FaRegEdit />,
    title: "Real-Time Feedback",
    description:
      "Get real-time feedback via customizable forms, so presenters receive what they require to become better—swiftly.",
  },
  {
    icon: <FaThLarge />,
    title: "All Decks in One Place",
    description:
      "Say goodbye to endless email threads. View, sort, and present pitch decks from a centralized dashboard.",
  },
  {
    icon: <FaLightbulb />,
    title: "Instant Insights",
    description:
      "See what worked, what didn’t, and what to do next—all backed by real data.",
  },
];

const benefits = [
  {
    icon: <FaUsers />,
    text: "Built for pitch events from the ground up",
  },
  {
    icon: <FaChess />,
    text: "No clunky software or unnecessary steps",
  },
  {
    icon: <FaExpandAlt />,
    text: "Scales easily for demo days big or small",
  },
  {
    icon: <FaClock />,
    text: "Saves time on planning, presenting, and follow-up",
  },
  {
    icon: <FaChalkboardTeacher />,
    text: "Helps investors and judges stay focused on the pitches",
  },
];

const benefitVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};
const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const Demoday = () => {
  return (
    <div>
      {/* Header */}
      <Header />
      <div className="demoday-page">
        {/* HERO SECTION */}
        <section className="demoday-hero">
          <div className="hero-pattern hero-pattern-one"></div>
          <div className="hero-pattern hero-pattern-two"></div>

          <Container>
            <motion.div
              className="demoday-hero-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                visible: {
                  transition: { staggerChildren: 0.18 },
                },
              }}
            >
              <motion.h1 variants={fadeUp}>
                <span>Transform Your Startup Pitches with </span>
                <strong>Demo Day Platform</strong>
              </motion.h1>

              <motion.h2 variants={fadeUp}>
                Take the Stress Out of Pitch Events Pitch events must operate as
                clockwork.
              </motion.h2>

              <motion.div
                className="hero-description-demoday"
                variants={fadeUp}
              >
                <p>
                  Demo Day is designed for accelerators, investors, and
                  organizers who need an efficient method to organize sessions,
                  be on top of things, and keep their priorities straight - the
                  pitches.
                </p>

                <p>
                  All you need to host, monitor, and gain insights from your
                  pitch events - everything in one platform.
                </p>

                <p>
                  Whether you're hosting a local demo day or a global investor
                  showcase, Demo Day has you covered.
                </p>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="demoday-process" id="get-started">
          <Container>
            <motion.h2
              className="process-heading"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              How It Works
            </motion.h2>

            <div className="process-timeline">
              <div className="timeline-line"></div>

              <Row className="g-4 justify-content-center">
                {steps.map((step, index) => (
                  <Col lg={4} md={4} sm={12} key={step.number}>
                    <motion.div
                      className={`process-card process-card-${index + 1}`}
                      initial={{ opacity: 0, y: 45 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.7,
                        delay: index * 0.2,
                      }}
                    >
                      <div className="timeline-dot"></div>

                      <motion.div
                        className="process-icon"
                        whileHover={{
                          scale: 1.12,
                          rotate: 5,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {step.icon}
                      </motion.div>

                      <h3>{step.title}</h3>

                      <p>{step.description}</p>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </div>
          </Container>
        </section>

        <section className="demo-features-section">
          <div className="demo-features-glow demo-glow-one" />
          <div className="demo-features-glow demo-glow-two" />

          <div className="container demo-features-container">
            <motion.div
              className="demo-features-heading"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
              <span className="demo-features-label">POWERFUL FEATURES</span>

              <h2>
                What You Get with <span>Demo Day Platform</span>
              </h2>

              <p>
                Everything you need to organize, manage, and elevate your
                startup pitch events.
              </p>
            </motion.div>

            <motion.div
              className="row g-3 g-md-4 demo-features-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  className="col-6 col-md-4"
                  key={feature.title}
                  variants={cardVariants}
                >
                  <motion.div
                    className="demo-feature-card"
                    whileHover={{
                      y: -8,
                      scale: 1.015,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    <div className="demo-feature-icon">{feature.icon}</div>

                    <h3>{feature.title}</h3>

                    <p>{feature.description}</p>

                    <div className="demo-card-bottom-line" />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="organizer-section">
          <div className="container organizer-container">
            <div className="row align-items-center g-4 g-lg-5">
              {/* LEFT IMAGE */}
              <motion.div
                className="col-12 col-lg-6"
                initial={{ opacity: 0, x: -45 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.8 }}
              >
                <div className="organizer-image-wrapper">
                  <img
                    src="./images/demoday.jpg"
                    alt="Demo Day event planning workspace"
                    className="organizer-main-image"
                  />
                  <div className="organizer-image-overlay" />
                </div>
              </motion.div>

              {/* RIGHT CONTENT */}
              <div className="col-12 col-lg-6">
                <motion.div
                  className="organizer-content"
                  initial={{ opacity: 0, x: 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.7 }}
                >
                  <span className="organizer-eyebrow">WHY DEMO DAY</span>

                  <h2>Why Organizers Choose Demo Day</h2>
                </motion.div>

                <motion.div
                  className="organizer-benefits-grid"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.12 },
                    },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {benefits.map((benefit, index) => (
                    <motion.div
                      className={`organizer-benefit-card benefit-card-${index + 1}`}
                      key={index}
                      variants={benefitVariants}
                      whileHover={{
                        y: -7,
                        scale: 1.03,
                      }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="organizer-benefit-icon">
                        {benefit.icon}
                      </div>

                      <p>{benefit.text}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="organizer-cta-section">
          <div className="organizer-cta-glow" />

          <motion.div
            className="container organizer-cta-content"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.75 }}
          >
            <span className="organizer-cta-label">
              YOUR NEXT BIG EVENT STARTS HERE
            </span>

            <h2>
              Let’s Make Your Next Pitch Event <span>Effortless</span>
            </h2>

            <p>
              Try Demo Day and see the difference smart management can make.
            </p>

            {/* <motion.button
              type="button"
              className="organizer-cta-button"
              whileHover={{
                scale: 1.06,
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
              whileTap={{ scale: 0.96 }}
              onClick={handleGetStarted}
            >
              Get Started
            </motion.button> */}
          </motion.div>
        </section>

        {/*  Contact Form*/}
        <Contactform />
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Demoday;
