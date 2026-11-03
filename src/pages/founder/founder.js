import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaArrowRight,
  FaLinkedinIn,
  FaLightbulb,
  FaRocket,
  FaHandshake,
  FaChartLine,
  FaUsers,
  FaBullseye,
  FaRegCompass,
  FaCalendarCheck,
  FaBrain,
  FaBuilding,
  FaQuoteLeft,
  FaStar,
  FaGlobe,
} from "react-icons/fa6";
import "./founder.css";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const founders = [
  {
    initials: "CS",
    name: "Chinmay Shah",
    role: "Founder & CEO",
    description:
      "Driving the vision of building a stronger startup ecosystem by connecting founders, investors, mentors, and opportunities.",
    linkedin: "https://www.linkedin.com/in/chinmayushah/",
    number: "01",
  },
  {
    initials: "NP",
    name: "Nirjari Parikh",
    role: "Co-Founder",
    description:
      "Working towards creating meaningful opportunities for entrepreneurs through collaboration, strategic thinking, and ecosystem development.",
    linkedin: "#",
    number: "02",
  },
];

const initiatives = [
  {
    icon: <FaHandshake />,
    number: "01",
    title: "Matchmaking",
    description:
      "Connecting startups with the right investors, mentors, partners, and ecosystem opportunities.",
  },
  {
    icon: <FaChartLine />,
    number: "02",
    title: "GTM Guru",
    description:
      "Helping startups build effective go-to-market strategies and reach the right customers.",
  },
  {
    icon: <FaBullseye />,
    number: "03",
    title: "Deal Flow",
    description:
      "Creating structured opportunities for startups to connect with investors and funding networks.",
  },
  {
    icon: <FaUsers />,
    number: "04",
    title: "Demo Day",
    description:
      "Giving emerging founders a platform to showcase their ideas, products, and business potential.",
  },
  {
    icon: <FaBrain />,
    number: "05",
    title: "ReadyScore AI",
    description:
      "Supporting startup readiness through structured insights and data-driven evaluation.",
  },
  {
    icon: <FaBuilding />,
    number: "06",
    title: "SPV Creation",
    description:
      "Exploring structured investment opportunities that help connect capital with promising ventures.",
  },
];

const Founder = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // or "smooth"
    });
  }, [pathname]);
  return (
    <div>
      {/* HEADER */}
      <Header />

      <main className="ss-founder-page">
        {/* HERO SECTION */}
        <section className="ss-hero">
          <div className="ss-hero-grid"></div>
          <div className="ss-glow ss-glow-one"></div>
          <div className="ss-glow ss-glow-two"></div>

          <Container className="ss-container">
            <Row className="align-items-center">
              <Col lg={9} xl={8}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={stagger}
                >
                  <motion.div variants={fadeUp} className="ss-eyebrow">
                    <span className="ss-eyebrow-line"></span>
                    THE PEOPLE BEHIND THE VISION
                  </motion.div>

                  <motion.h1 variants={fadeUp} className="ss-hero-title">
                    Building the future
                    <br />
                    of <span>entrepreneurship.</span>
                  </motion.h1>

                  <motion.p variants={fadeUp} className="ss-hero-description">
                    Every great ecosystem begins with a belief. At Startup
                    Steroid, our founders are driven by the belief that
                    ambitious entrepreneurs deserve access to the right
                    connections, knowledge, and opportunities.
                  </motion.p>
                  {/* 
                  <motion.div variants={fadeUp} className="ss-hero-actions">
                    <a href="#founders" className="ss-btn-primary">
                      Meet Our Founders <FaArrowRight />
                    </a>
                    <a href="#our-vision" className="ss-btn-outline">
                      Discover Our Vision
                    </a>
                  </motion.div> */}
                </motion.div>
              </Col>

              <Col lg={3} xl={4}>
                <motion.div
                  className="ss-hero-symbol"
                  initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  <div className="ss-symbol-ring ss-ring-one"></div>
                  <div className="ss-symbol-ring ss-ring-two"></div>
                  <div className="ss-symbol-center">
                    <FaRocket />
                  </div>
                  <span className="ss-symbol-dot ss-dot-one"></span>
                  <span className="ss-symbol-dot ss-dot-two"></span>
                  <span className="ss-symbol-dot ss-dot-three"></span>
                </motion.div>
              </Col>
            </Row>

            <motion.div
              className="ss-hero-bottom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span>VISION</span>
              <span className="ss-bottom-line"></span>
              <span>PEOPLE</span>
              <span className="ss-bottom-line"></span>
              <span>IMPACT</span>
            </motion.div>
          </Container>
        </section>

        {/* FOUNDERS SECTION */}
        {/* <section className="ss-section ss-founders-section" id="founders">
          <Container className="ss-container">
            <motion.div
              className="ss-section-heading"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <div className="ss-eyebrow">
                <span className="ss-eyebrow-line"></span>
                MEET THE FOUNDERS
              </div>
              <h2>
                Visionaries behind
                <br />
                <span>the mission.</span>
              </h2>
              <p>
                The people bringing the Startup Steroid vision to life through
                purpose, passion, and a commitment to entrepreneurial growth.
              </p>
            </motion.div>

            <Row className="g-4 ss-founder-row">
              {founders.map((founder) => (
                <Col lg={6} key={founder.initials}>
                  <motion.div
                    className="ss-founder-card"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                  >
                    <div className="ss-founder-card-top">
                      <span className="ss-founder-number">
                        {founder.number}
                      </span>
                      <span className="ss-founder-label">LEADERSHIP</span>
                    </div>

                    <div className="ss-founder-profile">
                      <div className="ss-founder-avatar">
                        <span>{founder.initials}</span>
                        <div className="ss-avatar-orbit"></div>
                      </div>

                      <div className="ss-founder-info">
                        <h3>{founder.name}</h3>
                        <span className="ss-founder-role">{founder.role}</span>
                      </div>
                    </div>

                    <p className="ss-founder-description">
                      {founder.description}
                    </p>

                    <div className="ss-founder-card-footer">
                      <span>STARTUP STEROID</span>
                      {founder.linkedin !== "#" && (
                        <a
                          href={founder.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${founder.name} LinkedIn profile`}
                        >
                          <FaLinkedinIn />
                        </a>
                      )}
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Container>
        </section> */}

        {/* VISION SECTION */}
        <section className="ss-section ss-vision-section" id="our-vision">
          <Container className="ss-container">
            <Row className="align-items-center g-5">
              <Col lg={5}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <div className="ss-eyebrow">
                    <span className="ss-eyebrow-line"></span>
                    WHY WE STARTED
                  </div>

                  <h2 className="ss-section-title">
                    Great ideas deserve
                    <br />
                    <span>the right ecosystem.</span>
                  </h2>
                </motion.div>
              </Col>

              <Col lg={7}>
                <motion.div
                  className="ss-vision-content"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <FaQuoteLeft className="ss-quote-icon" />
                  <p className="ss-vision-quote">
                    Entrepreneurship should not be a journey where founders have
                    to figure out everything alone. The right connections and
                    guidance can change the trajectory of a business.
                  </p>
                  <p className="ss-vision-text">
                    Startup Steroid is built around this belief. We aim to
                    bridge the gaps between ideas, execution, expertise, and
                    capital by creating meaningful connections across the
                    startup ecosystem.
                  </p>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* INITIATIVES SECTION */}
        <section className="ss-section ss-initiatives-section">
          <Container className="ss-container">
            <motion.div
              className="ss-section-heading"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="ss-eyebrow">
                <span className="ss-eyebrow-line"></span>
                WHAT WE ARE BUILDING
              </div>
              <h2>
                Turning vision into
                <br />
                <span>real opportunities.</span>
              </h2>
              <p>
                A connected ecosystem of initiatives designed to support
                founders at different stages of their entrepreneurial journey.
              </p>
            </motion.div>

            <Row className="g-4">
              {initiatives.map((item) => (
                <Col md={6} lg={4} key={item.number}>
                  <motion.div
                    className="ss-initiative-card"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={fadeUp}
                    whileHover={{ y: -8 }}
                  >
                    <div className="ss-initiative-top">
                      <div className="ss-initiative-icon">{item.icon}</div>
                      <span>{item.number}</span>
                    </div>

                    <h3>{item.title}</h3>
                    <p>{item.description}</p>

                    <div className="ss-initiative-line"></div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* PHILOSOPHY SECTION */}
        <section className="ss-section ss-philosophy-section">
          <Container className="ss-container">
            <motion.div
              className="ss-philosophy-box"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="ss-philosophy-icon">
                <FaLightbulb />
              </div>

              <div className="ss-philosophy-content">
                <div className="ss-eyebrow">OUR PHILOSOPHY</div>
                <h2>
                  We don't just support startups.
                  <br />
                  <span>We believe in their potential.</span>
                </h2>
                <p>
                  We believe that meaningful progress happens when founders,
                  investors, mentors, and innovators come together with a shared
                  purpose. Our focus is on building relationships that create
                  lasting value.
                </p>
              </div>

              <FaStar className="ss-philosophy-decoration" />
            </motion.div>
          </Container>
        </section>

        {/* ECOSYSTEM SECTION */}
        <section className="ss-section ss-ecosystem-section">
          <Container className="ss-container">
            <motion.div
              className="ss-section-heading"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="ss-eyebrow">
                <span className="ss-eyebrow-line"></span>
                THE BIGGER PICTURE
              </div>
              <h2>
                Stronger together.
                <br />
                <span>Better for everyone.</span>
              </h2>
              <p>
                A thriving startup ecosystem is built through collaboration
                between every stakeholder.
              </p>
            </motion.div>

            <motion.div
              className="ss-ecosystem-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { icon: <FaRocket />, label: "Startups" },
                { icon: <FaChartLine />, label: "Investors" },
                { icon: <FaUsers />, label: "Mentors" },
                { icon: <FaGlobe />, label: "Ecosystem Partners" },
              ].map((item, index) => (
                <motion.div
                  className="ss-ecosystem-item"
                  variants={fadeUp}
                  key={item.label}
                >
                  <span className="ss-ecosystem-number">0{index + 1}</span>
                  <div className="ss-ecosystem-icon">{item.icon}</div>
                  <h3>{item.label}</h3>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* CTA SECTION */}

        <section className="ss-cta-section">
          <Container className="ss-container">
            <motion.div
              className="ss-cta-box ss-payment-cta"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="ss-cta-decoration"></div>

              <div className="ss-eyebrow">
                <span className="ss-eyebrow-line"></span>
                INVEST IN YOUR NEXT BIG MOVE
              </div>

              <h2>
                Take the first step.
                <br />
                <span>Make it happen.</span>
              </h2>

              <p>
                Get started with our ecosystem and unlock new opportunities to
                grow, connect, and build something meaningful.
              </p>

              <div className="ss-payment-card">
                <span className="ss-price-label">
                  Registration / Program Fee
                </span>

                <h3>₹9,999</h3>

                <div className="ss-price-divider"></div>

                <div className="ss-price-row">
                  <span>Base Amount</span>
                  <strong>₹9,999</strong>
                </div>

                <div className="ss-price-row">
                  <span>GST (18%)</span>
                  <strong>₹1,799.82</strong>
                </div>

                <div className="ss-price-divider"></div>

                <div className="ss-price-row ss-total-row">
                  <span>Total Payable</span>
                  <strong>₹11,798.82</strong>
                </div>

                <small>Inclusive of 18% GST</small>
              </div>

              <NavLink to="#" className="ss-btn-primary">
                Proceed to Payment <FaArrowRight />
              </NavLink>

              <div className="ss-payment-note">
                <span>🔒</span> Secure Payment · Transparent Pricing
              </div>
            </motion.div>
          </Container>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Founder;
