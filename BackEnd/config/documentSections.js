// BackEnd/utils/documentSections.js
// MUST match src/pages/documation/documation.jsx `sections` exactly.

const DOCUMENT_SECTIONS = {
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

// All 29 document labels — flattened
const ALL_DOCUMENTS = Object.values(DOCUMENT_SECTIONS).flat();

module.exports = { DOCUMENT_SECTIONS, ALL_DOCUMENTS };