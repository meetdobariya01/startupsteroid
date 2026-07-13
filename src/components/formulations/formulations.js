import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import "./formulations.css";

const Formulations = () => {
  const items = [
    {
      no: "01",
      tag: "PAIRING",
      title: "INVESTOR MATCHMAKING",
      text: "A structured engine that pairs startups with investors based on thesis fit, cheque size, and stage.",
    },
    {
      no: "02",
      tag: "SUPPLY",
      title: "DEAL FLOW",
      text: "A curated, pre-vetted pipeline of Indian startups for investors seeking quality opportunities.",
    },
    {
      no: "03",
      tag: "DIAGNOSTIC",
      title: "READYSCORE AI",
      text: "An AI-driven readiness scan that scores startups on the metrics investors care about.",
    },
    {
      no: "04",
      tag: "EVENT",
      title: "DEMO DAY",
      text: "A quarterly stage where selected founders pitch live to investors and partners.",
    },
    {
      no: "05",
      tag: "STRUCTURE",
      title: "SPV",
      text: "Special Purpose Vehicle structuring for compliant and efficient syndication.",
    },
    {
      no: "06",
      tag: "CONDITIONING",
      title: "FINISHING SCHOOL",
      text: "A hands-on program to get founders pitch-ready and ecosystem-ready.",
    },
  ];
  return (
    <div>
      <section className="formulations py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <small className="section-tag">● WHAT'S IN THE BOTTLE</small>
            <h2 className="display-3 fw-bold mt-3">
              SIX FORMULATIONS. ONE GOAL: TERM SHEET READY.
            </h2>
            <p className="lead text-secondary mt-3 mb-5">
              Pick the dose your startup needs right now, or run the full
              course.
            </p>
          </motion.div>

          <Row className="g-4">
            {items.map((item, i) => (
              <Col md={6} lg={4} key={item.no}>
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-100 dose-card">
                    <Card.Body>
                      <small className="section-tag">
                        {item.no} · {item.tag}
                      </small>
                      <h3 className="mt-4 fw-bold">{item.title}</h3>
                      <p className="text-secondary mt-3">{item.text}</p>
                      <a href="/" className="explore-link">
                        EXPLORE →
                      </a>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Formulations;
