import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import "./contactform.css";

const Contactform = () => {
  return (
    <div>
      <section className="contact-section py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <h2 className="fw-bold mb-4">Get in Touch</h2>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Your Name" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control type="email" placeholder="Email Address" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control type="number" placeholder="Mobile Number" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Company Name" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Message"
                    />
                  </Form.Group>

                  <Button variant="outline-dark" size="lg">
                    Send Message
                  </Button>
                </Form>
              </motion.div>
            </Col>

            <Col lg={6}>
              <motion.img
                src="./images/contact.jpg"
                alt="Contact Us"
                className="img-fluid rounded-4 shadow"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contactform;
