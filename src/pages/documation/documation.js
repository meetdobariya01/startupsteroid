import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ProgressBar,
} from "react-bootstrap";
import "./documation.css";

const sections = {
  "A. Company & Legal Documents": [
    "Certificate of Incorporation (QRYX Tech Pvt. Ltd.)",
    "Memorandum & Articles of Association (MoA/AoA)",
    "Company PAN",
    "TAN (if applicable)",
    "GST Registration",
    "Udyam (MSME) Certificate",
    "DPIIT Recognition Certificate (if already obtained)",
    "Board Resolution authorizing grant/incubation application",
    "Cap Table / Shareholding Pattern",
  ],

  "B. Founder & Team Documents": [
    "Founder PAN & Aadhaar",
    "Founder CV / Bio",
    "Team Structure & Profiles",
  ],

  "C. Business & Product Documents": [
    "Startup Pitch Deck (10-15 slides)",
    "Detailed Project Report (DPR)",
    "Product Overview",
    "Prototype / Demo Link",
    "IP Filings",
    "Market Size & Competitive Landscape",
  ],

  "D. Financial Documents": [
    "Bank Details & Cancelled Cheque",
    "Financial Projections",
    "Revenue / Traction",
    "Previous Funding",
    "Use Of Funds",
  ],

  "E. Address & Compliance": [
    "Registered Office Proof",
    "Utility Bill / Rent Agreement",
  ],
};

const titles = Object.keys(sections);

const Documation = () => {
  const { pathname } = useLocation();

  const [step, setStep] = useState(0);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  const nextStep = () => {
    if (step < titles.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <>
      <Header />

      <section className="documention-section py-5">
        <Container>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h2 className="text-center fw-bold mb-4">Grant Application</h2>

              <ProgressBar
                now={((step + 1) / titles.length) * 100}
                className="mb-5"
              />

              <h4 className="fw-bold mb-4 text-color">{titles[step]}</h4>

              <Row className="g-4">
                {sections[titles[step]].map((field) => (
                  <Col md={6} key={field}>
                    <Form.Group>
                      <Form.Label>{field}</Form.Label>

                      <Form.Control type="file" />
                    </Form.Group>
                  </Col>
                ))}
              </Row>

              <div className="d-flex justify-content-between mt-5">
                <Button
                  className="btn-css"
                  variant="secondary"
                  onClick={prevStep}
                  disabled={step === 0}
                >
                  Previous
                </Button>

                {step === titles.length - 1 ? (
                  <Button className="btn-css" variant="success">
                    Submit Application
                  </Button>
                ) : (
                  <Button className="btn-css" onClick={nextStep}>
                    Next
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default Documation;
