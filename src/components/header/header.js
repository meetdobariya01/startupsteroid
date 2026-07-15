import { useState } from "react";
import { Navbar, Container, Nav, Button, Offcanvas } from "react-bootstrap";
import { motion } from "framer-motion";
import { HiOutlineMenuAlt3, HiMenu, HiOutlineUserCircle } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import "./header.css";

const menu = [
  { name: "MATCHMAKING", path: "/matchmaking" },
  { name: "DEAL FLOW", path: "/dealflow" },
  { name: "READYSCORE AI", path: "/readyscore" },
  { name: "DEMO DAY", path: "/demo-day" },
  { name: "SPV", path: "/spv" },
  { name: "FINISHING SCHOOL", path: "/finishing-school" },
];

const Header = () => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Navbar expand="lg" className="premium-navbar py-3">
        <Container fluid="xl">
          {/* Logo */}

          <Navbar.Brand href="/">
            <img
              src="./images/logo.png"
              alt="Startup Steroid Rx"
              height="70"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          {/* Desktop */}

          <Nav className="mx-auto d-none d-lg-flex align-items-center gap-4">
            {menu.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.08 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? "nav-link-custom active-nav" : "nav-link-custom"
                  }
                >
                  {item.name}
                </NavLink>
              </motion.div>
            ))}
          </Nav>

          <div className="d-none d-lg-block">
            <Button as={NavLink} to="/assessed" className="assess-btn ">
              GET ASSESSED
            </Button>
          </div>
          <a href="/login" className="ms-3 text-decoration-none text-white">
            <HiOutlineUserCircle size={32} />
          </a>

          {/* Mobile Toggle */}

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ rotate: 90 }}
            className="menu-toggle d-lg-none"
            onClick={() => setShow(true)}
          >
            <HiOutlineMenuAlt3 />
          </motion.button>
        </Container>
      </Navbar>

      {/* Mobile Menu */}

      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement="end"
        className="premium-menu"
      >
        <Offcanvas.Header>
          <motion.div initial={{ rotate: 0 }} whileHover={{ rotate: 180 }}>
            <button className="close-btn" onClick={() => setShow(false)}>
              <IoClose />
            </button>
          </motion.div>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Navbar.Brand href="/">
            <img
              src="./images/logo.png"
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
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? "mobile-link active-mobile-link" : "mobile-link"
                  }
                  onClick={() => setShow(false)}
                >
                  {item.name}
                </NavLink>
              </motion.div>
            ))}

            <Button as={NavLink} to="/assessed" className="assess-btn ">
              GET ASSESSED
            </Button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Header;
