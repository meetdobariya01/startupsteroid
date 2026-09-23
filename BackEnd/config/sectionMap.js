// BackEnd/config/sectionMap.js
const { ALL_DOCUMENTS } = require('../config/documentSections');

// "Company PAN" → "company_pan"
// "Certificate of Incorporation (QRYX Tech Pvt. Ltd.)"
//   → "certificate_of_incorporation_qryx_tech_pvt_ltd"
const slugify = (s) =>
  String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const DESC_TO_KEY = {};  // { "Company PAN": "company_pan" }
const KEY_TO_DESC = {};  // { "company_pan": "Company PAN" }

ALL_DOCUMENTS.forEach((desc) => {
  const key = slugify(desc);
  DESC_TO_KEY[desc] = key;
  KEY_TO_DESC[key] = desc;
});

function getSectionForFile(file) {
  if (!file || !file.description) return null;

  const trimmed = file.description.trim();

  // 1. Exact match
  if (DESC_TO_KEY[trimmed]) return DESC_TO_KEY[trimmed];

  // 2. Case-insensitive exact match
  const lower = trimmed.toLowerCase();
  for (const desc of ALL_DOCUMENTS) {
    if (desc.toLowerCase() === lower) {
      return DESC_TO_KEY[desc];
    }
  }

  // 3. Substring match (handles legacy descriptions)
  for (const desc of ALL_DOCUMENTS) {
    if (lower.includes(desc.toLowerCase())) {
      return DESC_TO_KEY[desc];
    }
  }

  return null;
}

module.exports = {
  slugify,
  DESC_TO_KEY,
  KEY_TO_DESC,
  getSectionForFile,
};