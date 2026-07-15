import React from "react";
import { Container, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import './audiencesection.css'

const Audiencesection = () => {
  return (
    <div>
      <section className="audience-section py-5 text-white">
        <Container className="text-center">
          <motion.h2
            className="audience-title mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Solutions • Resources • Company • Careers
          </motion.h2>

          <motion.p
            className="lead audience-text mx-auto"
            style={{ maxWidth: "900px" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            Demo Day is designed for accelerators, investors, and organizers who
            need an efficient way to organize sessions, keep priorities
            straight, and stay on top of pitches.
            <br />
            <br />
            It empowers mentors, founders, and investors with powerful tools to
            collaborate and scale business possibilities.
          </motion.p>

          <motion.div
            className="d-flex justify-content-center gap-3 flex-wrap mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Button className="px-5 py-3" variant="outline-light">Investors</Button>
            <Button
              variant="outline-danger"
              className="px-5 py-3 secondary-btn"
            >
              Founders
            </Button>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default Audiencesection;
