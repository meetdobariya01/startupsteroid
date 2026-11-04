import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import "./herosec.css";

const Herosec = () => {
  const items = [
    ["Diagnostic", "ReadyScore AI - 1 scan"],
    ["Pairing", "Investor Matchmaking - ongoing"],
    ["Supply", "Deal Flow - curated feed"],
    ["Structure", "SPV - per round"],
    ["Conditioning", "Finishing School - 6 wks"],
    ["Event", "Demo Day - quarterly"],
  ];
  return (
    <div>
      <section className="hero-section py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <p className="hero-tag">● RX FOR INDIAN STARTUPS</p>
                <h1 className="hero-title-home text-uppercase">
                  Your Startup. Properly Registered. Legally Structured.
                  <span> Ready to Grow.</span>
                </h1>

                <p className="hero-text">
                  From business incorporation to government registrations, legal
                  documentation and ongoing compliance, Startup Steroids helps
                  entrepreneurs build and scale their businesses with
                  confidence.
                </p>

                <div className="d-flex flex-wrap gap-3 mt-4 justify-content-center">
                  <Button as={NavLink} to="/founder" variant="danger">
                    ARE YOU STARTUP ?
                  </Button>

                  <Button as={NavLink} to="/investors" variant="outline-light">
                    ARE YOU INVESTORS ?
                  </Button>
                </div>
              </motion.div>
            </Col>

            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Card className="info-card">
                  <Card.Body>
                    <p className="hero-tag">● LABEL · THE FULL REGIMEN</p>
                    {items.map(([k, v]) => (
                      <div
                        key={k}
                        className="d-flex justify-content-between border-bottom py-3"
                      >
                        <span>{k}</span>
                        <strong>{v}</strong>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Herosec;
