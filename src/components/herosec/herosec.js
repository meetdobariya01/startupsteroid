import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
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
                <h1 className="hero-title">
                  GROWTH,
                  <br />
                  PRESCRIBED <br />
                  <span>IN DOSES.</span>
                </h1>

                <p className="hero-text">
                  Startup Steroid India is the acceleration stack for founders
                  and the investors who back them.
                </p>

                <div className="d-flex flex-wrap gap-3 mt-4">
                  <Button variant="danger" size="">
                    GET YOUR READYSCORE
                  </Button>
                  <Button variant="outline-light" size="">
                    EXPLORE FOR INVESTORS
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
