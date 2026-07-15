import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import "./assessed.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const plans = [
  {
    name: "Founder",
    price: "₹9,999",
    features: [
      "Dedicated support",
      "Monthly updates",
      "Beta access",
      "Priority onboarding",
    ],
  },
  {
    name: "Investor",
    price: "₹39,999",
    features: [
      "Dedicated support",
      "Monthly investor reports",
      "Access to mentorship sessions",
      "Early product beta access",
    ],
    // featured: true,
  },
];

const Assessed = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      <section className="start-here-section py-5">
        <Container>
          <motion.p
            className="section-tag mb-3"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            ● START HERE
          </motion.p>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            TELL US WHICH DOSE YOU NEED.
          </motion.h1>

          <motion.p
            className="hero-subtitle mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            One form, routed to the right team - whether you're a founder, an
            investor, or applying to Finishing School.
          </motion.p>
        </Container>
      </section>

      <section className="pricing-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5">Choose Your Plan</h2>
            <p className="text-muted">
              Flexible pricing designed to grow with your startup.
            </p>
          </div>

          <Row className="g-4">
            {plans.map((plan, i) => (
              <Col md={6} lg={6} key={plan.name}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <Card
                    className={`h-100 text-center pricing-card ${plan.featured ? "featured" : ""}`}
                  >
                    <Card.Body className="p-4">
                      <h4>{plan.name}</h4>
                      <div className="display-4 my-3">
                        {plan.price}
                        <span className="fs-6">/One Time</span>
                      </div>
                      <ul className="list-unstyled mb-4">
                        {plan.features.map((f) => (
                          <li key={f} className="mb-2">
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Button
                        as={NavLink}
                        to="/documation"
                        variant={plan.featured ? "dark" : "outline-dark"}
                      >
                        Pay Now
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Assessed;
