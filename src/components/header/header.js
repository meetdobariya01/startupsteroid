import { useState } from "react";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Offcanvas,
  NavDropdown,
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineMenuAlt3,
  HiOutlineUserCircle,
  HiChevronDown,
} from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { NavLink, useLocation } from "react-router-dom";
import "./header.css";

const menu = [
  {
    name: "MATCHMAKING",
    path: "/matchmaking",
    children: [
      { name: "Investors", path: "/investors" },
      { name: "Founders", path: "/founder" },
    ],
  },
  { name: "GTM GURU", path: "/gtm-guru" },
  { name: "DEAL FLOW", path: "/dealflow" },
  { name: "DEMO DAY", path: "/demoday" },
  { name: "READYSCORE AI", path: "/readyscore" },
  { name: "SPV", path: "/spv" },
];

const Header = () => {
  const [show, setShow] = useState(false);
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => {
    setShow(false);
    setShowMatchmaking(false);
  };

  const isMatchmakingActive = location.pathname.startsWith("/matchmaking");

  return (
    <div>
      <Navbar expand="lg" className="premium-navbar py-3">
        <Container fluid="xl">
          {/* Logo */}
          <Navbar.Brand as={NavLink} to="/">
            <img
              src="/images/logo.png"
              alt="Startup Steroid Rx"
              height="70"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <Nav className="mx-auto d-none d-lg-flex align-items-center gap-4">
            {menu.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.08 }}
              >
                {item.children ? (
                  <NavDropdown
                    title={
                      <span className="matchmaking-dropdown-title">
                        {item.name}
                        <HiChevronDown />
                      </span>
                    }
                    id="matchmaking-dropdown"
                    className={`custom-nav-dropdown ${
                      isMatchmakingActive ? "active-nav-dropdown" : ""
                    }`}
                  >
                    {item.children.map((child) => (
                      <NavDropdown.Item
                        key={child.path}
                        as={NavLink}
                        to={child.path}
                        end={child.path === "/matchmaking"}
                        className={({ isActive }) =>
                          isActive
                            ? "dropdown-link active-dropdown-link"
                            : "dropdown-link"
                        }
                      >
                        {child.name}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link-custom active-nav"
                        : "nav-link-custom"
                    }
                  >
                    {item.name}
                  </NavLink>
                )}
              </motion.div>
            ))}
          </Nav>

          {/* Desktop CTA */}
          <div className="d-none d-lg-block">
            <Button as={NavLink} to="/assessed" className="assess-btn">
              GET ASSESSED
            </Button>
          </div>

          {/* Profile */}
          <NavLink
            to="/login"
            className="ms-3 text-decoration-none profile-icon-link"
            aria-label="Login"
          >
            <HiOutlineUserCircle size={32} />
          </NavLink>

          {/* Mobile Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ rotate: 90 }}
            className="menu-toggle d-lg-none"
            onClick={() => setShow(true)}
            aria-label="Open navigation menu"
          >
            <HiOutlineMenuAlt3 />
          </motion.button>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas
        show={show}
        onHide={closeMobileMenu}
        placement="end"
        className="premium-menu"
      >
        <Offcanvas.Header>
          <motion.div initial={{ rotate: 0 }} whileHover={{ rotate: 180 }}>
            <button
              className="close-btn"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <IoClose />
            </button>
          </motion.div>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Navbar.Brand as={NavLink} to="/" onClick={closeMobileMenu}>
            <img
              src="/images/logo.png"
              alt="Startup Steroid Rx"
              height="70"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          <Nav className="flex-column mt-5 lh-lg">
            {menu.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.08 }}
                className="mobile-menu-item"
              >
                {item.children ? (
                  <>
                    {/* Matchmaking Dropdown Toggle */}
                    <button
                      type="button"
                      className={`mobile-link mobile-dropdown-toggle ${
                        isMatchmakingActive ? "active-mobile-link" : ""
                      }`}
                      onClick={() => setShowMatchmaking(!showMatchmaking)}
                    >
                      <span>{item.name}</span>
                      <motion.span
                        animate={{
                          rotate: showMatchmaking ? 180 : 0,
                        }}
                        transition={{ duration: 0.25 }}
                      >
                        <HiChevronDown />
                      </motion.span>
                    </button>

                    {/* Matchmaking Submenu */}
                    <AnimatePresence>
                      {showMatchmaking && (
                        <motion.div
                          className="mobile-submenu"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.children.map((child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              end={child.path === "/matchmaking"}
                              className={({ isActive }) =>
                                isActive
                                  ? "mobile-sublink active-mobile-sublink"
                                  : "mobile-sublink"
                              }
                              onClick={closeMobileMenu}
                            >
                              {child.name}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? "mobile-link active-mobile-link"
                        : "mobile-link"
                    }
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </NavLink>
                )}
              </motion.div>
            ))}

            <Button
              as={NavLink}
              to="/assessed"
              className="assess-btn mt-4"
              onClick={closeMobileMenu}
            >
              GET ASSESSED
            </Button>

            <NavLink
              to="/login"
              className="mobile-link mt-3"
              onClick={closeMobileMenu}
            >
              <HiOutlineUserCircle className="me-2" size={22} />
              LOGIN
            </NavLink>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Header;
