import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import "./readyscore.css";

const metrics = [
  {
    title: "Market & traction",
    text: "Signal on real demand, not just a slide claiming it.",
  },
  {
    title: "Team & execution",
    text: "Founder-market fit and delivery track record.",
  },
  {
    title: "Financial hygiene",
    text: "Cap table, burn, and unit economics investors can trust.",
  },
  {
    title: "Narrative & pitch",
    text: "Whether the story lands in the first ninety seconds.",
  },
];

const Readyscore = () => {
  const score = 78;
  const angle = (score / 100) * 360;
  return (
    <div>
      <section className="readyscore-section py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <small className="section-tag">● READINESS, QUANTIFIED</small>
            <h2 className="display-3 fw-bold mt-3">
              YOUR READYSCORE, AT A GLANCE.
            </h2>
            <p className="lead text-secondary">
              One number that tells founders and investors exactly how
              funding-ready a startup is today.
            </p>
          </motion.div>

          <Row className="align-items-center mt-5 g-5">
            <Col lg={5} className="text-center">
              <motion.div
                className="score-ring"
                style={{
                  background: `conic-gradient(#d8ff36 ${angle}deg, #252b38 0)`,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
              >
                <div className="score-inner">
                  <h1>{score}</h1>
                  <span>READYSCORE</span>
                </div>
              </motion.div>
            </Col>

            <Col lg={7}>
              {metrics.map((m, i) => (
                <motion.div
                  key={m.title}
                  className="metric-item py-3 border-bottom border-secondary"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <h5>＋ {m.title}</h5>
                  <p className="text-secondary mb-0">{m.text}</p>
                </motion.div>
              ))}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Readyscore;
