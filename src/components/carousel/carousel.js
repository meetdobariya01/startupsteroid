import React from "react";
import { Carousel } from "react-bootstrap";
import { motion } from "framer-motion";
import { Button } from "react-bootstrap";
import './carousel.css'

const Carouselmain = () => {
  return (
    <div>
      <Carousel
        fade
        controls={false}
        indicators={true}
        interval={3000}
        pause={false}
      >
        {/* Slide 1 - Image */}
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-media"
            src="./images/c-img.jpg"
            alt="First slide"
          />
          <Carousel.Caption className="hero-caption">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h5>Build Your Business in GIFT City</h5>

              <h1>
                Your Gateway to India's
                <span> Global Financial Hub</span>
              </h1>

              <p>
                We help startups, multinational companies, and entrepreneurs
                establish their presence in GIFT City with complete business
                setup, compliance, office space, and relocation services.
              </p>

              <div className="hero-buttons">
                <Button className="btn-primary-custom">Get Started</Button>

                <Button variant="outline-light">Learn More</Button>
              </div>
            </motion.div>
          </Carousel.Caption>
        </Carousel.Item>

        {/* Slide 2 - Video */}
        <Carousel.Item interval={8000}>
          <video
            className="d-block w-100 carousel-media"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="./images/c1-video.mp4" type="video/mp4" />
          </video>
        </Carousel.Item>

        {/* Slide 3 - Image */}
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-media"
            src="./images/blog-1.jpg"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Carouselmain;
