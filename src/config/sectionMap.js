// FrontEnd/src/config/sectionMap.js
// ⚠️ MUST be identical to BackEnd/config/sectionMap.js

export const slugify = (s) =>
    String(s)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

// Desc → key
export const DESC_TO_KEY = {
    "Certificate of Incorporation (QRYX Tech Pvt. Ltd.)": slugify(
        "Certificate of Incorporation (QRYX Tech Pvt. Ltd.)"
    ),
    "Memorandum & Articles of Association (MoA/AoA)": slugify(
        "Memorandum & Articles of Association (MoA/AoA)"
    ),
    "Company PAN": slugify("Company PAN"),
    "TAN (if applicable)": slugify("TAN (if applicable)"),
    "GST Registration": slugify("GST Registration"),
    "Udyam (MSME) Certificate": slugify("Udyam (MSME) Certificate"),
    "DPIIT Recognition Certificate (if already obtained)": slugify(
        "DPIIT Recognition Certificate (if already obtained)"
    ),
    "Board Resolution authorizing grant/incubation application": slugify(
        "Board Resolution authorizing grant/incubation application"
    ),
    "Cap Table / Shareholding Pattern": slugify("Cap Table / Shareholding Pattern"),
    "Founder PAN & Aadhaar": slugify("Founder PAN & Aadhaar"),
    "Founder CV / Bio": slugify("Founder CV / Bio"),
    "Team Structure & Profiles": slugify("Team Structure & Profiles"),
    "Startup Pitch Deck (10-15 slides)": slugify("Startup Pitch Deck (10-15 slides)"),
    "Detailed Project Report (DPR)": slugify("Detailed Project Report (DPR)"),
    "Product Overview": slugify("Product Overview"),
    "Prototype / Demo Link": slugify("Prototype / Demo Link"),
    "IP Filings": slugify("IP Filings"),
    "Market Size & Competitive Landscape": slugify("Market Size & Competitive Landscape"),
    "Bank Details & Cancelled Cheque": slugify("Bank Details & Cancelled Cheque"),
    "Financial Projections": slugify("Financial Projections"),
    "Revenue / Traction": slugify("Revenue / Traction"),
    "Previous Funding": slugify("Previous Funding"),
    "Use Of Funds": slugify("Use Of Funds"),
    "Registered Office Proof": slugify("Registered Office Proof"),
    "Utility Bill / Rent Agreement": slugify("Utility Bill / Rent Agreement"),
};

// Key → desc
export const KEY_TO_DESC = Object.fromEntries(
    Object.entries(DESC_TO_KEY).map(([d, k]) => [k, d])
);

// ─────────────────────────────────────────────
// Optional runtime sanity check (safe in all builds)
// ─────────────────────────────────────────────
(() => {
    const mismatch = Object.keys(DESC_TO_KEY).filter(
        (d) => DESC_TO_KEY[d] !== slugify(d)
    );
    if (mismatch.length) {
        console.error("❌ [sectionMap] DESC_TO_KEY mismatch:", mismatch);
    } else {
        console.log("✅ [sectionMap] DESC_TO_KEY is internally consistent.");
    }
})();