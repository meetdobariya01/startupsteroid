import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  Spinner
} from "react-bootstrap";
import axios from "axios";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFileExcel,
  FaFileAlt,
  FaTrashAlt,
  FaDownload,
  FaEye,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaExclamationTriangle
} from "react-icons/fa";
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
const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/files`;

const Documation = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [token] = useState(localStorage.getItem("token"));
  const [uploads, setUploads] = useState({});
  const [uploading, setUploading] = useState({});
  const [toast, setToast] = useState(null);
  
  // Preview Modal States
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState(null);

  // Summary Modal States
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname, step]);

  // Auth check
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUploadedFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const showToast = (message, variant = "success") => {
    setToast({ message, variant });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleRequestError = (err, actionDescription) => {
    console.error(`Error during ${actionDescription}:`, err);
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      showToast("Session expired. Redirecting to login...", "danger");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      const message = err.response?.data?.message || `Failed to ${actionDescription}. Please check your connection.`;
      showToast(message, "danger");
    }
  };

  // Save uploads to localStorage
  const saveUploadsToStorage = (uploadsData) => {
    try {
      localStorage.setItem('documation_uploads', JSON.stringify(uploadsData));
    } catch (error) {
      console.error('Error saving uploads:', error);
    }
  };

  // Load uploads from localStorage
  const loadUploadsFromStorage = () => {
    try {
      const saved = localStorage.getItem('documation_uploads');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading uploads:', error);
    }
    return {};
  };

  // Fetch uploaded files
  const fetchUploadedFiles = async () => {
    try {
      // First check localStorage
      const savedUploads = loadUploadsFromStorage();
      if (Object.keys(savedUploads).length > 0) {
        setUploads(savedUploads);
      }

      const response = await axios.get(`${API_URL}/`, {
        params: { limit: 100 },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.success) {
        const files = response.data.data.files || [];
        const uploadsMap = {};
        files.forEach(f => {
          if (f.description) {
            uploadsMap[f.description] = {
              id: f._id,
              name: f.originalName,
              size: f.fileSize,
              type: f.mimeType,
              folder: f.folder
            };
          }
        });
        setUploads(uploadsMap);
        // Save to localStorage
        saveUploadsToStorage(uploadsMap);
      }
    } catch (err) {
      handleRequestError(err, "loading existing files");
    }
  };

  // Handle file upload - ONLY ONE VERSION
  const handleFileUpload = async (field, file) => {
    if (!file) return;
    
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      showToast(`${field}: File exceeds 10MB limit.`, "danger");
      return;
    }

    setUploading(prev => ({ ...prev, [field]: 1 }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", titles[step]);
    formData.append("description", field);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploading(prev => ({ ...prev, [field]: percentCompleted }));
        }
      });

      if (response.data && response.data.success) {
        const fileData = response.data.data.file;
        setUploads(prev => {
          const newUploads = {
            ...prev,
            [field]: {
              id: fileData.id || fileData._id,
              name: fileData.name || fileData.originalName,
              size: fileData.size || fileData.fileSize,
              type: fileData.type || fileData.mimeType,
              folder: fileData.folder
            }
          };
          // Save to localStorage
          saveUploadsToStorage(newUploads);
          return newUploads;
        });
        showToast(`${field} uploaded successfully!`, "success");
      }
    } catch (err) {
      handleRequestError(err, `uploading file for "${field}"`);
    } finally {
      setUploading(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Handle download
  const handleDownload = async (fileId, fileName) => {
    try {
      showToast("Preparing download...", "info");
      const response = await axios.get(`${API_URL}/${fileId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      });
      
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      handleRequestError(err, "downloading file");
    }
  };

  // Handle delete - remove from localStorage
  const handleDelete = async (fileId, fieldName) => {
    if (!window.confirm(`Are you sure you want to delete the document for "${fieldName}"?`)) {
      return;
    }
    try {
      const response = await axios.delete(`${API_URL}/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.success) {
        setUploads(prev => {
          const copy = { ...prev };
          delete copy[fieldName];
          // Save to localStorage
          saveUploadsToStorage(copy);
          return copy;
        });
        showToast(`Document for "${fieldName}" deleted.`, "success");
      }
    } catch (err) {
      handleRequestError(err, `deleting file for "${fieldName}"`);
    }
  };

  // Handle preview
  const handlePreview = async (file) => {
    setPreviewFile(file);
    setShowPreviewModal(true);
    setLoadingPreview(true);
    setPreviewError(null);
    
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    try {
      const fileId = file.id || file._id;
      console.log('🔍 Previewing file with ID:', fileId);
      
      const response = await axios.get(`${API_URL}/${fileId}/preview`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      });

      const blob = new Blob([response.data], { 
        type: file.type || response.headers["content-type"] || 'application/pdf' 
      });
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setLoadingPreview(false);
    } catch (err) {
      console.error("Preview error:", err);
      setPreviewError("Unable to load preview. Please download the file to view it.");
      setLoadingPreview(false);
    }
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewFile(null);
    setPreviewError(null);
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

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

  const handleFinalSubmit = () => {
    setShowSummaryModal(true);
  };

  const confirmSubmission = () => {
    setShowSummaryModal(false);
    setSubmitted(true);
    showToast("Application submitted successfully!", "success");
  };

  // Drag and Drop component helper
  const DragDropUpload = ({ field }) => {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(field, e.dataTransfer.files[0]);
      }
    };

    const handleChange = (e) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFileUpload(field, e.target.files[0]);
      }
    };

    const onButtonClick = () => {
      fileInputRef.current.click();
    };

    return (
      <div 
        className={`upload-zone ${dragActive ? "active" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input 
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleChange}
        />
        <FaCloudUploadAlt className="upload-zone-icon" />
        <span className="fw-semibold text-color">Drag & Drop file here</span>
        <span className="text-secondary-custom" style={{ fontSize: "12px", marginTop: "4px" }}>
          or click to upload (Max 10MB)
        </span>
      </div>
    );
  };

  // Uploaded state card helper
  const UploadedFileCard = ({ field, file }) => {
    const formatSize = (bytes) => {
      if (!bytes) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = (mimeType) => {
      if (!mimeType) return <FaFileAlt className="file-type-icon" />;
      if (mimeType.includes("pdf")) return <FaFilePdf className="file-type-icon" style={{ color: "#ff4d4f" }} />;
      if (mimeType.startsWith("image/")) return <FaFileImage className="file-type-icon" style={{ color: "#d4ff2a" }} />;
      if (mimeType.includes("word") || mimeType.includes("officedocument.wordprocessingml")) {
        return <FaFileWord className="file-type-icon" style={{ color: "#1890ff" }} />;
      }
      if (mimeType.includes("excel") || mimeType.includes("spreadsheet") || mimeType.includes("officedocument.spreadsheetml")) {
        return <FaFileExcel className="file-type-icon" style={{ color: "#52c41a" }} />;
      }
      return <FaFileAlt className="file-type-icon" />;
    };

    const isPreviewable = file.type && (file.type.startsWith("image/") || file.type.includes("pdf"));

    return (
      <div className="uploaded-file-card">
        <div className="file-info-container">
          {getFileIcon(file.type)}
          <div className="file-details">
            <span className="file-name" title={file.name}>{file.name}</span>
            <span className="file-meta">{formatSize(file.size)}</span>
          </div>
        </div>
        <div className="file-action-buttons">
          {isPreviewable && (
            <button 
              type="button" 
              className="btn-file-action" 
              title="Preview File"
              onClick={(e) => { e.stopPropagation(); handlePreview(file); }}
            >
              <FaEye />
            </button>
          )}
          <button 
            type="button" 
            className="btn-file-action btn-download" 
            title="Download File"
            onClick={(e) => { e.stopPropagation(); handleDownload(file.id, file.name); }}
          >
            <FaDownload />
          </button>
          <button 
            type="button" 
            className="btn-file-action btn-delete" 
            title="Delete File"
            onClick={(e) => { e.stopPropagation(); handleDelete(file.id, field); }}
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
    );
  };

  const UploadProgressCard = ({ percent }) => {
    return (
      <div className="upload-progress-container">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="fw-semibold text-color" style={{ fontSize: "14px" }}>Uploading document...</span>
          <span className="text-secondary-custom fw-bold" style={{ fontSize: "13px" }}>{percent}%</span>
        </div>
        <div className="progress">
          <div 
            className="progress-bar-custom" 
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  // Stepper Header
  const Stepper = () => {
    const progressPercent = (step / (titles.length - 1)) * 100;
    
    const getStepCompletion = (stepIdx) => {
      const stepFields = sections[titles[stepIdx]];
      const uploadedCount = stepFields.filter(f => !!uploads[f]).length;
      return {
        uploaded: uploadedCount,
        total: stepFields.length,
        isFullyCompleted: uploadedCount === stepFields.length
      };
    };

    return (
      <div className="stepper-wrapper">
        <div className="stepper-progress-line">
          <div 
            className="stepper-progress-line-fill" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {titles.map((title, idx) => {
          const { uploaded, total, isFullyCompleted } = getStepCompletion(idx);
          const isActive = step === idx;
          const isCompleted = isFullyCompleted;
          const numberLabel = idx + 1;
          
          return (
            <div 
              key={title}
              className={`step-node ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
              onClick={() => setStep(idx)}
            >
              <div className="step-circle">
                {isCompleted ? <FaCheck /> : numberLabel}
              </div>
              <div className="step-label">
                Step {numberLabel}
                <span className="d-block text-secondary-custom" style={{ fontSize: "9px" }}>
                  ({uploaded}/{total})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render the final submission success view
  if (submitted) {
    return (
      <>
        <Header />
        <section className="documention-section py-5 d-flex align-items-center" style={{ minHeight: "80vh" }}>
          <Container>
            <Card className="shadow border-0 rounded-4 text-center mx-auto p-4 p-md-5" style={{ maxWidth: "600px" }}>
              <Card.Body>
                <div className="mb-4">
                  <FaCheckCircle className="text-success" size={72} />
                </div>
                <h2 className="fw-bold mb-3 text-color">Application Submitted!</h2>
                <p className="text-secondary-custom mb-5">
                  Your grant application and document uploads have been successfully recorded in our secure GridFS storage. Our verification team will review your company, founder, financial, and compliance credentials and contact you within 5–7 business days.
                </p>
                <div className="d-flex flex-column gap-3 justify-content-center align-items-center">
                  <Button className="btn-css w-100" variant="success" onClick={() => navigate("/")}>
                    Return Home
                  </Button>
                  <Button className="w-100 btn-css" variant="outline-light" onClick={() => setSubmitted(false)}>
                    Review Uploaded Files
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Container>
        </section>
        <Footer />
      </>
    );
  }

  // Calculate stats for current step
  const currentStepFields = sections[titles[step]];
  const currentStepUploadedCount = currentStepFields.filter(f => !!uploads[f]).length;

  return (
    <>
      <Header />

      <section className="documention-section py-5">
        <Container>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h2 className="text-center fw-bold mb-4 text-color">Grant Application Documents</h2>
              
              {/* Stepper progress component */}
              <Stepper />

              {/* Step info banner */}
              <div className="d-flex align-items-center justify-content-between mb-4 mt-5">
                <h4 className="fw-bold m-0 text-color">{titles[step]}</h4>
                <span className="text-secondary-custom fw-bold" style={{ fontSize: "14px" }}>
                  ({currentStepUploadedCount} of {currentStepFields.length} uploaded)
                </span>
              </div>

              <Row className="g-4">
                {currentStepFields.map((field) => {
                  const isUploading = uploading[field] !== undefined;
                  const fileData = uploads[field];

                  return (
                    <Col md={6} key={field}>
                      <Form.Group className="h-100 d-flex flex-column">
                        <Form.Label className="text-color fw-semibold mb-2">{field}</Form.Label>
                        <div className="flex-grow-1">
                          {isUploading ? (
                            <UploadProgressCard percent={uploading[field]} />
                          ) : fileData ? (
                            <UploadedFileCard field={field} file={fileData} />
                          ) : (
                            <DragDropUpload field={field} />
                          )}
                        </div>
                      </Form.Group>
                    </Col>
                  );
                })}
              </Row>

              {/* Navigation controls */}
              <div className="d-flex justify-content-between mt-5 pt-3 border-top border-secondary">
                <Button
                  className="btn-css d-flex align-items-center gap-2 justify-content-center"
                  variant="secondary"
                  onClick={prevStep}
                  disabled={step === 0}
                >
                  <FaArrowLeft size={13} /> Previous
                </Button>

                {step === titles.length - 1 ? (
                  <Button 
                    className="btn-css d-flex align-items-center gap-2 justify-content-center" 
                    variant="success"
                    onClick={handleFinalSubmit}
                  >
                    Submit Application <FaCheckCircle size={13} />
                  </Button>
                ) : (
                  <Button 
                    className="btn-css d-flex align-items-center gap-2 justify-content-center" 
                    onClick={nextStep}
                  >
                    Next <FaArrowRight size={13} />
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* Preview Modal */}
      <Modal 
        show={showPreviewModal} 
        onHide={closePreviewModal}
        size="lg"
        centered
        className="preview-modal"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="text-color text-truncate" style={{ maxWidth: "80%" }}>
            {previewFile?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="preview-container">
            {loadingPreview && (
              <div className="text-center p-5">
                <Spinner animation="border" variant="light" className="mb-2" />
                <div className="text-secondary-custom">Fetching file content securely...</div>
              </div>
            )}
            
            {previewError && (
              <div className="text-center p-5 text-danger">
                <FaExclamationTriangle className="mb-3" size={48} />
                <div>{previewError}</div>
              </div>
            )}

            {!loadingPreview && !previewError && previewUrl && (
              <>
                {previewFile?.type?.startsWith("image/") ? (
                  <img src={previewUrl} alt={previewFile.name} className="preview-image" />
                ) : (
                  <iframe src={previewUrl} title={previewFile?.name} className="preview-pdf" />
                )}
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePreviewModal}>
            Close
          </Button>
          {previewFile && (
            <Button variant="success" onClick={() => handleDownload(previewFile.id, previewFile.name)}>
              Download File
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Summary / Confirmation Modal */}
      <Modal 
        show={showSummaryModal} 
        onHide={() => setShowSummaryModal(false)}
        size="lg"
        centered
        className="preview-modal"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="text-color">
            Review Application Documents
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto", padding: "24px" }}>
          <p className="text-secondary-custom mb-4">
            Below is a summary of all document categories. Please verify that all required documents have been uploaded before confirming your submission.
          </p>

          {titles.map((category) => {
            const fields = sections[category];
            const uploadedFields = fields.filter(f => !!uploads[f]);
            
            return (
              <div key={category} className="mb-4">
                <h5 className="summary-category-header">
                  {category} ({uploadedFields.length} of {fields.length} uploaded)
                </h5>
                <div className="mt-2">
                  {fields.map(field => {
                    const file = uploads[field];
                    return (
                      <div key={field} className={`summary-item ${file ? "completed" : "missing"}`}>
                        <span className="fw-semibold" style={{ fontSize: "13px" }}>{field}</span>
                        {file ? (
                          <span className="text-success d-flex align-items-center gap-1" style={{ fontSize: "12px" }}>
                            <FaCheckCircle /> {file.name.length > 25 ? `${file.name.substring(0, 22)}...` : file.name}
                          </span>
                        ) : (
                          <span className="text-danger d-flex align-items-center gap-1" style={{ fontSize: "12px" }}>
                            <FaExclamationTriangle /> Missing File
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSummaryModal(false)}>
            Go Back & Edit
          </Button>
          <Button variant="success" onClick={confirmSubmission}>
            Confirm and Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Toast Alert */}
      {toast && (
        <div className="custom-toast p-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <FaCheckCircle className={toast.variant === "success" || toast.variant === "info" ? "text-success" : "text-danger"} size={20} />
            <span className="fw-semibold">{toast.message}</span>
          </div>
          <button className="btn-close btn-close-white ms-2" onClick={() => setToast(null)}></button>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Documation;