import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import "./protocol.css";

const steps = [
  {
    no: "01",
    title: "DIAGNOSE",
    text: "Run ReadyScore AI to see exactly where the startup stands before anyone else does.",
  },
  {
    no: "02",
    title: "CONDITION",
    text: "Close the gaps identified through coaching, pitch refinement, and unit economics work.",
  },
  {
    no: "03",
    title: "PAIR & PIPE",
    text: "Enter matchmaking and deal flow to meet investors whose thesis truly fits.",
  },
  {
    no: "04",
    title: "PERFORM",
    text: "Pitch at Demo Day, complete the SPV process, and raise on your own terms.",
  },
];

const Protocol = () => {
  return (
    <div>
      <section className="protocol-section py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <small className="protocol-tag">● THE PROTOCOL</small>
            <h2 className="protocol-title mt-3">
              ORDER MATTERS. HERE'S <br /> THE REGIMEN.
            </h2>
            <p className="protocol-subtitle">
              Each stage feeds the next — this is a sequence, not a menu.
            </p>
          </motion.div>

          <Row className="mt-5 g-4">
            {steps.map((step, i) => (
              <Col lg={3} md={6} key={step.no}>
                <motion.div
                  className="protocol-step h-100"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="step-no">{step.no}</span>
                  <h4 className="mt-3 fw-bold">{step.title}</h4>
                  <p className="mt-3">{step.text}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Protocol;
