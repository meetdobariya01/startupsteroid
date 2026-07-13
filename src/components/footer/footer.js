import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaInstagram,
  FaXTwitter,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa6";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import './footer.css'

const Footer = () => {
  return (
    <div>
      <footer className="footer py-5">
        <Container>
          <Row className="gy-4">
            <Col lg={4}>
              <img
                src="./images/logo.png"
                alt="Startup Steroid"
                className="footer-logo mb-4"
              />
              <p className="footer-text">
                One platform, complete connectivity: journey effortlessly from
                deal sourcing to deal syndication with our integrated solution.
              </p>
            </Col>

            <Col sm={4} lg={2}>
              <h5>Solutions</h5>
              <a href="/">Deal Flow</a>
              <a href="/">Demo Day</a>
            </Col>

            <Col sm={4} lg={3}>
              <h5>Quick Link</h5>
              <a href="/">Blog</a>
              <a href="/">Privacy Policy</a>
            </Col>

            <Col sm={4} lg={3}>
              <h5>Contact Us</h5>
              <p>
                <HiOutlineMail /> info@startupsteroid.in
              </p>
              <p>
                <HiOutlinePhone /> +91 98240 18555
              </p>
            </Col>
          </Row>

          <hr className="my-4" />

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <span>© 2025 All Rights Reserved.</span>

            <div className="social-icons">
              <FaInstagram />
              <FaXTwitter />
              <FaFacebookF />
              <FaYoutube />
              <FaLinkedinIn />
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Footer;
