import React, { useEffect } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsChatLeftText, BsQuestionCircle, BsPeople } from "react-icons/bs";
import AOS from "aos";
import {
  FaFilePowerpoint,
  FaFileAlt,
  FaTable,
  FaBullseye,
  FaPlayCircle,
  FaChartLine,
  FaFileSignature,
} from "react-icons/fa";
import "./dealflow.css";
import Contactform from "../../components/contactform/contactform";

const cards = [
  {
    title: "A clear startup view",
    desc: "Your story, traction, and numbers in an investor-friendly format.",
  },
  {
    title: "One place for materials",
    desc: "All your fundraising documents, always up to date.",
  },
  {
    title: "Readiness insight",
    desc: "See how prepared you are and what needs work.",
  },
  {
    title: "One link to share",
    desc: "A clean, secure data room for investors.",
  },
];
const uploadItems = [
  {
    icon: <FaFilePowerpoint />,
    title: "Pitch deck",
  },
  {
    icon: <FaFileAlt />,
    title: "One-pager or executive summary",
  },
  {
    icon: <FaTable />,
    title: "Financial projections and cap table",
  },
  {
    icon: <FaBullseye />,
    title: "Go-to-market plans",
  },
  {
    icon: <FaPlayCircle />,
    title: "Product demos and screenshots",
  },
  {
    icon: <FaChartLine />,
    title: "Customer traction and metrics",
  },
  {
    icon: <FaFileSignature />,
    title: "Legal and compliance documents",
  },
];
const outcomeData = [
  {
    icon: <BsChatLeftText />,
    title: "Less back and forth.",
  },
  {
    icon: <BsQuestionCircle />,
    title: "Fewer follow-up questions.",
  },
  {
    icon: <BsPeople />,
    title: "More focused conversations.",
  },
];
const Dealflow = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      <section className="founder-section">
        {/* Hero */}

        <div className="hero-area text-white">
          <Container>
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="badge-founder">Founders</span>

              <h2>
                Built for Founders <span>Raising Capital</span>
              </h2>

              <h5>Fundraising gets messy fast.</h5>

              <p>
                InvestorConnect365 gives you one place to stay organized and
                investor-ready. Your startup, your materials, and your progress
                are all managed from a single profile built around how investors
                review companies.
              </p>
            </motion.div>
          </Container>
        </div>

        {/* Cards */}

        <Container>
          <motion.h2
            className="section-title text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            What This <span>Gives You</span>
          </motion.h2>

          <Row className="g-4 mt-4">
            {cards.map((item, index) => (
              <Col lg={3} md={6} key={index}>
                <motion.div
                  className="feature-card-dealflow"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.6,
                  }}
                  whileHover={{
                    y: -12,
                    scale: 1.03,
                  }}
                  viewport={{ once: true }}
                >
                  <div className="icon-box">
                    <HiOutlineDocumentText />
                  </div>

                  <h4>{item.title}</h4>

                  <p>{item.desc}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="upload-section">
        <Container>
          {/* Heading */}

          <motion.div
            className="text-center mb-5"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="upload-title text-white">
              What You Can <span>Upload</span>
            </h2>
          </motion.div>

          <Row className="align-items-center">
            {/* Left */}

            <Col lg={5} className="mb-5 mb-lg-0">
              <motion.div
                className="startup-wrapper"
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="circle-border"></div>

                <img
                  src="./images/dealflow.png"
                  alt="Startup"
                  className="startup-image"
                />

                <span className="dot dot1"></span>
                <span className="dot dot2"></span>
                <span className="dot dot3"></span>
              </motion.div>
            </Col>

            {/* Right */}

            <Col lg={7}>
              {uploadItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="upload-card"
                  initial={{ opacity: 0, x: 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    scale: 1.02,
                    x: 10,
                  }}
                  viewport={{ once: true }}
                >
                  <div className="upload-icon">{item.icon}</div>

                  <h5>{item.title}</h5>
                </motion.div>
              ))}
            </Col>
          </Row>
        </Container>
      </section>

      <section className="outcome-section">
        <Container>
          <div className="section-heading text-center">
            <h2>
              The <span>Outcome</span>
            </h2>

            <p>A single, reliable view of your startup for investors.</p>
          </div>

          <Row className="g-4 mt-2">
            {outcomeData.map((item, index) => (
              <Col
                lg={4}
                md={6}
                sm={12}
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <div className="outcome-card">
                  <div className="icon-box">{item.icon}</div>

                  <h5>{item.title}</h5>
                </div>
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

export default Dealflow;
