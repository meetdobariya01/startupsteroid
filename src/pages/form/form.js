import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, ProgressBar } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import { getData } from "country-list";
import {
  FaArrowLeft, FaArrowRight, FaCheck, FaCloudUploadAlt, FaFilePdf,
  FaFilePowerpoint, FaTrash, FaBuilding, FaUser, FaChartLine, FaAlignLeft,
  FaFileAlt, FaLinkedinIn, FaSave
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

import api from "../../api/axios";
import "react-phone-input-2/lib/style.css";
import "./form.css";

const countries = getData();

const steps = [
  { id: 1, title: "Contact Information", shortTitle: "Contact", icon: <FaUser /> },
  { id: 2, title: "Company Information", shortTitle: "Company", icon: <FaBuilding /> },
  { id: 3, title: "Financial Information", shortTitle: "Financial", icon: <FaChartLine /> },
  { id: 4, title: "Description", shortTitle: "Description", icon: <FaAlignLeft /> },
  { id: 5, title: "Pitch Deck", shortTitle: "Pitch Deck", icon: <FaFileAlt /> },
];

const initialFormData = {
  firstName: "", lastName: "", email: "", phone: "", linkedin: "", companyTitle: "",
  companyName: "", website: "", industry: "", developmentStage: "", businessModel: "", country: "",
  fundingType: "", preMoneyValuation: "", targetRaise: "", annualRevenue: "", offeringType: "",
  description: "", companyDescription: "", productDescription: "",
  pitchDeck: [],
};

const industryOptions = [
  "Computing Hardware", "Digital Media - Consumer (App/Web App/Digital Services)",
  "Digital Media - Enterprise (App / Web App / Digital Services)", "Health and Wellness",
  "Internet/Web Services", "Networking and Equipment", "Software", "Web and Technology",
];

const developmentStageOptions = [
  "R&D", "Product Development", "MVP", "Beta/Shipping to Customers", "Scaling", "Follow on Offerings",
];

const businessModelOptions = ["B to B", "B to C", "B to B to C", "Other"];
const fundingOptions = ["Pre Seed", "Seed", "Late Seed", "Series A", "Series B", "Series C"];
const revenueOptions = ["$0", "$1-$10k", "$10k - $100k", "$100k - $1m", "More than $1m"];
const offeringOptions = ["Convertible Note", "Safe Note", "Equity", "Other"];

const slideVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.25, ease: "easeIn" } },
};

const MAX_FILE_MB = 15;
const MAX_FILES = 5;

function StartupApplicationForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // ✅ Load from localStorage on initial render
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("startup_form_draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...initialFormData, ...parsed, pitchDeck: [] }; // Always reset pitchDeck
      } catch (e) {
        return initialFormData;
      }
    }
    return initialFormData;
  });

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [uploadPct, setUploadPct] = useState(0);

  const fileInputRef = useRef(null);

  // ✅ Auto-save to localStorage whenever formData changes
  useEffect(() => {
    // Check if form has any data to avoid saving an empty form on first load
    const hasData = Object.keys(formData).some((key) => {
      if (key === "pitchDeck") return false;
      return formData[key] && formData[key].toString().trim() !== "";
    });

    if (hasData) {
      const dataToSave = { ...formData };
      delete dataToSave.pitchDeck;
      localStorage.setItem("startup_form_draft", JSON.stringify(dataToSave));
      setShowDraftBanner(true);
      
      // Hide the banner after 3 seconds
      const timeout = setTimeout(() => setShowDraftBanner(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [formData]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
      if (!formData.email.trim()) newErrors.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address.";
      if (!formData.phone || formData.phone.length < 8) newErrors.phone = "Phone number is required.";
      if (!formData.linkedin.trim()) newErrors.linkedin = "LinkedIn URL is required.";
      if (!formData.companyTitle.trim()) newErrors.companyTitle = "Company title is required.";
    }

    if (currentStep === 2) {
      if (!formData.companyName.trim()) newErrors.companyName = "Company name is required.";
      if (!formData.website.trim()) newErrors.website = "Website is required.";
      if (!formData.industry) newErrors.industry = "Please select an industry.";
      if (!formData.developmentStage) newErrors.developmentStage = "Please select development stage.";
      if (!formData.businessModel) newErrors.businessModel = "Please select business model.";
      if (!formData.country) newErrors.country = "Please select your country.";
    }

    if (currentStep === 3) {
      if (!formData.fundingType) newErrors.fundingType = "Please select funding type.";
      if (!formData.preMoneyValuation.trim()) newErrors.preMoneyValuation = "Pre-money valuation is required.";
      if (!formData.targetRaise.trim()) newErrors.targetRaise = "Target raise is required.";
      if (!formData.annualRevenue) newErrors.annualRevenue = "Please select annual revenue.";
      if (!formData.offeringType) newErrors.offeringType = "Please select offering type.";
    }

    if (currentStep === 4) {
      if (!formData.description.trim()) newErrors.description = "Description is required.";
      if (!formData.companyDescription.trim()) newErrors.companyDescription = "Company description is required.";
      if (!formData.productDescription.trim()) newErrors.productDescription = "Product/Service description is required.";
    }

    if (currentStep === 5) {
      if (!formData.pitchDeck.length) newErrors.pitchDeck = "Please upload your pitch deck.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFileChange = (files) => {
    const selectedFiles = Array.from(files || []);
    const allowedTypes = ["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
    const validFiles = [];
    const rejected = [];

    for (const file of selectedFiles) {
      const extOk = file.name.toLowerCase().endsWith(".pdf") || file.name.toLowerCase().endsWith(".ppt") || file.name.toLowerCase().endsWith(".pptx");
      const typeOk = allowedTypes.includes(file.type);

      if (!extOk && !typeOk) {
        rejected.push(`${file.name} (unsupported type)`);
        continue;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        rejected.push(`${file.name} (over ${MAX_FILE_MB} MB)`);
        continue;
      }
      validFiles.push(file);
    }

    setFormData((prev) => {
      const combined = [...prev.pitchDeck, ...validFiles].slice(0, MAX_FILES);
      return { ...prev, pitchDeck: combined };
    });

    setErrors((prev) => ({ ...prev, pitchDeck: rejected.length ? `Skipped: ${rejected.join(", ")}` : "" }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) handleFileChange(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    setFormData((prev) => ({ ...prev, pitchDeck: prev.pitchDeck.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(null);
    setUploadPct(0);

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "pitchDeck") return;
        fd.append(key, value);
      });
      formData.pitchDeck.forEach((file) => fd.append("pitchDeck", file));

      const { data } = await api.post("/api/application/complete", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (evt.total) setUploadPct(Math.round((evt.loaded * 100) / evt.total));
        },
      });

      setSubmitSuccess({
        id: data.applicationId,
        message: "Application saved! Redirecting to payment...",
      });

      // ✅ Clear the draft since submission was successful
      localStorage.removeItem("startup_form_draft");

      setTimeout(() => {
        navigate("/founder", { state: { applicationId: data.applicationId } });
      }, 2000);

    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message;

      if (status === 401) {
        setSubmitError("Your session expired. Please log in again.");
        setTimeout(() => navigate("/login", { replace: true }), 1500);
      } else if (status === 413) {
        setSubmitError("Files are too large. Please reduce and try again.");
      } else if (status === 429) {
        setSubmitError("Too many requests. Please wait a moment.");
      } else {
        setSubmitError(msg || "Submission failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getFileIcon = (file) => file.name.toLowerCase().endsWith(".pdf") ? <FaFilePdf /> : <FaFilePowerpoint />;
  const progress = (currentStep / steps.length) * 100;

  return (
    <section className="startup-form-section">
      <Container>
        <motion.div className="startup-form-header text-center" initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="startup-form-badge">Startup Application</span>
          <h1>Tell Us About <span>Your Company</span></h1>
          <p>Complete the application below to help us understand your company, product and funding requirements.</p>
        </motion.div>

        {/* ✅ Draft Saved Indicator */}
        {showDraftBanner && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            style={{ textAlign: "center", color: "#10b981", marginBottom: "1rem", fontSize: "0.9rem", fontWeight: "600" }}
          >
            <FaSave /> Draft saved automatically
          </motion.div>
        )}

        <div className="startup-form-wrapper">
          <div className="form-progress-wrapper">
            <div className="step-progress-line"><ProgressBar now={progress} /></div>
            <div className="form-steps">
              {steps.map((step) => {
                const active = currentStep === step.id;
                const completed = currentStep > step.id;
                return (
                  <div className={`form-step-item ${active ? "active" : ""} ${completed ? "completed" : ""}`} key={step.id}>
                    <div className="form-step-circle">{completed ? <FaCheck /> : step.icon}</div>
                    <div className="form-step-text">
                      <span className="step-number">STEP {step.id}</span>
                      <span className="step-title">{step.shortTitle}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} variants={slideVariants} initial="initial" animate="animate" exit="exit">
                {currentStep === 1 && (
                  <div className="form-section-content">
                    <SectionHeading icon={<FaUser />} title="Contact Information" description="Tell us how we can get in touch with you." />
                    <Row>
                      <Col md={6}><FormField label="First Name" required value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="Enter first name" error={errors.firstName} /></Col>
                      <Col md={6}><FormField label="Last Name" required value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Enter last name" error={errors.lastName} /></Col>
                      <Col md={6}><FormField label="Email Address" required type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="you@example.com" error={errors.email} /></Col>
                      <Col md={6}>
                        <Form.Group className="premium-form-group">
                          <Form.Label>Phone Number <span>*</span></Form.Label>
                          <PhoneInput country="in" enableSearch countryCodeEditable={false} value={formData.phone} onChange={(phone) => updateField("phone", phone)} inputClass="premium-phone-input" containerClass="premium-phone-container" buttonClass="premium-phone-button" searchClass="premium-phone-search" />
                          {errors.phone && <div className="field-error">{errors.phone}</div>}
                        </Form.Group>
                      </Col>
                      <Col md={6}><FormField label="LinkedIn URL" required value={formData.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} placeholder="https://linkedin.com/in/yourname" error={errors.linkedin} icon={<FaLinkedinIn />} /></Col>
                      <Col md={6}><FormField label="Your Company Title" required value={formData.companyTitle} onChange={(e) => updateField("companyTitle", e.target.value)} placeholder="e.g. Founder & CEO" error={errors.companyTitle} /></Col>
                    </Row>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="form-section-content">
                    <SectionHeading icon={<FaBuilding />} title="Company Information" description="Give us some details about your company." />
                    <Row>
                      <Col md={6}><FormField label="Company Name" required value={formData.companyName} onChange={(e) => updateField("companyName", e.target.value)} placeholder="Enter company name" error={errors.companyName} /></Col>
                      <Col md={6}><FormField label="Website" required value={formData.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://yourcompany.com" error={errors.website} /></Col>
                      <Col md={6}><SelectField label="Most Appropriate Industry Vertical" required value={formData.industry} onChange={(e) => updateField("industry", e.target.value)} options={industryOptions} placeholder="Select industry vertical" error={errors.industry} /></Col>
                      <Col md={6}><SelectField label="Development Stage" required value={formData.developmentStage} onChange={(e) => updateField("developmentStage", e.target.value)} options={developmentStageOptions} placeholder="Select development stage" error={errors.developmentStage} /></Col>
                      <Col md={6}><SelectField label="Business Model" required value={formData.businessModel} onChange={(e) => updateField("businessModel", e.target.value)} options={businessModelOptions} placeholder="Select business model" error={errors.businessModel} /></Col>
                      <Col md={6}><SelectField label="Country" required value={formData.country} onChange={(e) => updateField("country", e.target.value)} options={countries.map((c) => c.name)} placeholder="Select country" error={errors.country} /></Col>
                    </Row>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="form-section-content">
                    <SectionHeading icon={<FaChartLine />} title="Financial Information" description="Tell us about your current funding and financial position." />
                    <Row>
                      <Col md={6}><SelectField label="Type of Funding" required value={formData.fundingType} onChange={(e) => updateField("fundingType", e.target.value)} options={fundingOptions} placeholder="Select funding type" error={errors.fundingType} /></Col>
                      <Col md={6}><CurrencyField label="Pre-Money Valuation" required value={formData.preMoneyValuation} onChange={(e) => updateField("preMoneyValuation", e.target.value)} placeholder="Enter valuation" error={errors.preMoneyValuation} /></Col>
                      <Col md={6}><CurrencyField label="How Much Capital Is Being Raised?" required helper="Target Raise" value={formData.targetRaise} onChange={(e) => updateField("targetRaise", e.target.value)} placeholder="Enter target raise" error={errors.targetRaise} /></Col>
                      <Col md={6}><SelectField label="Annual Revenue" required value={formData.annualRevenue} onChange={(e) => updateField("annualRevenue", e.target.value)} options={revenueOptions} placeholder="Select annual revenue" error={errors.annualRevenue} /></Col>
                      <Col md={6}><SelectField label="Type of Offering" required value={formData.offeringType} onChange={(e) => updateField("offeringType", e.target.value)} options={offeringOptions} placeholder="Select offering type" error={errors.offeringType} /></Col>
                    </Row>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="form-section-content">
                    <SectionHeading icon={<FaAlignLeft />} title="Description" description="Help us understand your company and what you are building." />
                    <Row>
                      <Col xs={12}><TextAreaField label="Description" required value={formData.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Give us a brief overview..." rows={5} error={errors.description} maxLength={1000} /></Col>
                      <Col xs={12}><TextAreaField label="Company Description" required value={formData.companyDescription} onChange={(e) => updateField("companyDescription", e.target.value)} placeholder="Describe your company, vision and mission..." rows={6} error={errors.companyDescription} maxLength={2000} /></Col>
                      <Col xs={12}><TextAreaField label="Product / Service Description" required value={formData.productDescription} onChange={(e) => updateField("productDescription", e.target.value)} placeholder="Describe your product or service..." rows={6} error={errors.productDescription} maxLength={2000} /></Col>
                    </Row>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="form-section-content">
                    <SectionHeading icon={<FaFileAlt />} title="Pitch Deck" description="Upload your pitch deck to complete your application." />
                    <div className={`pitch-upload-box ${dragActive ? "drag-active" : ""}`} onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }} onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
                      <input ref={fileInputRef} type="file" multiple accept=".pdf,.ppt,.pptx" hidden onChange={(e) => handleFileChange(e.target.files)} />
                      <motion.div className="upload-icon" animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}><FaCloudUploadAlt /></motion.div>
                      <h4>Drag & Drop your files</h4>
                      <p>or <span className="browse-text">Browse</span></p>
                      <small>PDF, PPT, PPTX · Max {MAX_FILES} files · Up to {MAX_FILE_MB} MB each</small>
                    </div>
                    {errors.pitchDeck && <div className="field-error upload-error">{errors.pitchDeck}</div>}
                    {formData.pitchDeck.length > 0 && (
                      <div className="uploaded-files">
                        <h6>Uploaded Files ({formData.pitchDeck.length})</h6>
                        {formData.pitchDeck.map((file, index) => (
                          <motion.div className="uploaded-file-item" key={`${file.name}-${index}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="uploaded-file-left">
                              <div className="file-icon">{getFileIcon(file)}</div>
                              <div><strong>{file.name}</strong><span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span></div>
                            </div>
                            <button type="button" className="remove-file-btn" onClick={(e) => { e.stopPropagation(); removeFile(index); }}><FaTrash /></button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    <div className="pitch-note">
                      <strong>Pitch Deck Tip:</strong>
                      <span>Upload your latest investor-ready presentation including your business, market, product, traction, team and funding requirements.</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {submitError && <div className="submit-banner error" role="alert">{submitError}</div>}
            {submitSuccess && (
              <div className="submit-banner success" role="status">
                ✅ {submitSuccess.message}<br />
                <small>Reference ID: {submitSuccess.id}</small><br />
                <small>Redirecting to payment…</small>
              </div>
            )}
            {submitting && uploadPct > 0 && <div className="upload-progress"><ProgressBar now={uploadPct} label={`${uploadPct}%`} /></div>}

            <div className="form-navigation">
              {currentStep > 1 ? (
                <Button type="button" className="previous-btn" onClick={handlePrevious} disabled={submitting}><FaArrowLeft /> Previous</Button>
              ) : <div />}
              {currentStep < steps.length ? (
                <Button type="button" className="next-btn" onClick={handleNext} disabled={submitting}>Continue <FaArrowRight /></Button>
              ) : (
                <Button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? `Submitting… ${uploadPct || 0}%` : "Submit & Proceed to Payment"}
                  {!submitting && <FaCheck />}
                </Button>
              )}
            </div>
          </Form>
        </div>
      </Container>
    </section>
  );
}

function SectionHeading({ icon, title, description }) {
  return (
    <div className="section-heading">
      <div className="section-heading-icon">{icon}</div>
      <div><h2>{title}</h2><p>{description}</p></div>
    </div>
  );
}

function FormField({ label, required, type = "text", value, onChange, placeholder, error, icon }) {
  return (
    <Form.Group className="premium-form-group">
      <Form.Label>{label} {required && <span>*</span>}</Form.Label>
      <div className="input-with-icon">
        {icon && <span className="input-icon">{icon}</span>}
        <Form.Control type={type} value={value} onChange={onChange} placeholder={placeholder} className={error ? "is-invalid" : ""} />
      </div>
      {error && <div className="field-error">{error}</div>}
    </Form.Group>
  );
}

function SelectField({ label, required, value, onChange, options, placeholder, error }) {
  return (
    <Form.Group className="premium-form-group">
      <Form.Label>{label} {required && <span>*</span>}</Form.Label>
      <Form.Select value={value} onChange={onChange} className={error ? "is-invalid" : ""}>
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </Form.Select>
      {error && <div className="field-error">{error}</div>}
    </Form.Group>
  );
}

function CurrencyField({ label, required, helper, value, onChange, placeholder, error }) {
  return (
    <Form.Group className="premium-form-group">
      <Form.Label>{label} {required && <span>*</span>}{helper && <small className="label-helper">({helper})</small>}</Form.Label>
      <div className="currency-input">
        <span>₹</span>
        <Form.Control type="text" inputMode="numeric" value={value} onChange={onChange} placeholder={placeholder} className={error ? "is-invalid" : ""} />
      </div>
      {error && <div className="field-error">{error}</div>}
    </Form.Group>
  );
}

function TextAreaField({ label, required, value, onChange, placeholder, rows, error, maxLength }) {
  return (
    <Form.Group className="premium-form-group">
      <div className="textarea-label-row">
        <Form.Label>{label} {required && <span>*</span>}</Form.Label>
        {maxLength && <small>{value.length}/{maxLength}</small>}
      </div>
      <Form.Control as="textarea" rows={rows} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength} className={error ? "is-invalid" : ""} />
      {error && <div className="field-error">{error}</div>}
    </Form.Group>
  );
}

export default StartupApplicationForm;