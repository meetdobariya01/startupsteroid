import React, { useEffect } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Container, Row, Col } from "react-bootstrap";
import {
  HiOutlineLightBulb,
  HiOutlineSupport,
  HiOutlineDocumentSearch,
  HiOutlineUserGroup,
} from "react-icons/hi";
import {
  BsFileEarmarkText,
  BsSearch,
  BsHeadset,
  BsFileEarmarkCheck,
  BsPeopleFill,
} from "react-icons/bs";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "./readyscore.css";
import Contactform from "../../components/contactform/contactform";

const features = [
  {
    title: "One readiness score",
    text: "A single number that reflects how investor-ready your startup appears.",
  },
  {
    title: "A category breakdown",
    text: "See where you are strong and where gaps exist.",
  },
  {
    title: "Clear improvement points",
    text: "Understand what's missing before investors point it out.",
  },
  {
    title: "Prioritized next steps",
    text: "Know what to fix first instead of guessing.",
  },
];
const reasons = [
  {
    icon: <BsSearch />,
    title: "See blind spots before investors do",
  },
  {
    icon: <BsHeadset />,
    title: "Avoid pitching too early",
  },
  {
    icon: <BsFileEarmarkCheck />,
    title: "Focus effort on what actually matters",
  },
  {
    icon: <BsPeopleFill />,
    title: "Walk into meetings more prepared and confident",
  },
];
const data = [
  {
    icon: <HiOutlineLightBulb />,
    title: "See blind spots before investors do",
  },
  {
    icon: <HiOutlineSupport />,
    title: "Avoid pitching too early",
  },
  {
    icon: <HiOutlineDocumentSearch />,
    title: "Focus effort on what actually matters",
  },
  {
    icon: <HiOutlineUserGroup />,
    title: "Walk into meetings more prepared and confident",
  },
];

const Readyscore = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
    });
  }, []);
  return (
    <div>
      {/* Header */}
      <Header />

      <section className="readyscore-section">
        <Container>
          <div
            className="hero-content-readyscore text-center"
            data-aos="fade-down"
          >
            <span className="badge-title">ReadyScore</span>

            <h2>How Ready Are You to Pitch?</h2>

            <p>
              Investors decide fast.
              <br />
              ReadyScore shows you how prepared you look right now.
            </p>
          </div>

          <div className="text-center section-title">
            <h3 data-aos="fade-up">What You Get</h3>
          </div>

          <Row className="g-4 mt-2">
            {features.map((item, index) => (
              <Col
                lg={3}
                md={6}
                key={index}
                data-aos="zoom-in"
                data-aos-delay={index * 150}
              >
                <div className="feature-card-readyscore">
                  <div className="icon-box-readyscore">
                    <BsFileEarmarkText />
                  </div>

                  <h4>{item.title}</h4>

                  <p>{item.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="why-ready-section">
        <Container>
          <div className="text-center section-header">
            <h2>
              Why Founders Use <span>ReadyScore</span>
            </h2>

            <p>
              Most rejections come from gaps, not bad ideas.
              <br />
              Founders use ReadyScore to:
            </p>
          </div>

          <Row className="g-4 mt-4">
            {reasons.map((item, index) => (
              <Col
                lg={6}
                md={6}
                sm={12}
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="reason-card">
                  <div className="reason-icon">{item.icon}</div>

                  <h5>{item.title}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="founder-section">
        <Container>
          <motion.div
            className="heading text-center"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2>
              Why Founders Use <span>ReadyScore</span>
            </h2>

            <p>
              Most rejections come from gaps, not bad ideas.
              <br />
              Founders use ReadyScore to:
            </p>
          </motion.div>

          <Row className="g-4 mt-4">
            {data.map((item, index) => (
              <Col lg={6} md={6} key={index}>
                <motion.div
                  className="founder-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                  }}
                  viewport={{ once: true }}
                >
                  <div className="card-icon">{item.icon}</div>

                  <h4>{item.title}</h4>
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

export default Readyscore;
