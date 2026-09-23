// BackEnd/utils/emailTemplates.js

const sectionNames = {
  brandDescription: 'Brand Description',
  companyLogo: 'Company Logo',
  aadhaarDetails: 'Aadhaar Details',
  panDetails: 'PAN Details',
  gstDetails: 'GST Details',
  bankDetails: 'Bank Details',
  contactInfo: 'Contact Information',
  businessInfo: 'Business Information',
};

const header = `
  <div style="background:#111;padding:24px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:22px;">StartupSteroid</h1>
  </div>
`;

const footer = `
  <div style="padding:20px;text-align:center;color:#888;font-size:12px;background:#f8f8f8;">
    © ${new Date().getFullYear()} StartupSteroid. All rights reserved.
  </div>
`;

const wrapper = (body) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
    ${header}
    <div style="padding:32px;color:#333;line-height:1.6;">${body}</div>
    ${footer}
  </div>
`;

// ─────────────────────────────────────────────
// 1. All Documents Verified
// ─────────────────────────────────────────────
const allVerifiedTemplate = (user) => ({
  subject: '✅ Your Documents Have Been Verified',
  html: wrapper(`
    <h2 style="color:#16a34a;margin-top:0;">Your Documents Have Been Verified</h2>
    <p>Hi <strong>${user.username || user.email}</strong>,</p>
    <p>Great news! All of your submitted documents have been reviewed and <strong style="color:#16a34a;">verified</strong> by our team.</p>
    <p>Your account is now fully verified. You can access all features on StartupSteroid.</p>
    <p style="margin-top:24px;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/documation"
         style="background:#16a34a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
        View Your Documents
      </a>
    </p>
  `),
});

// ─────────────────────────────────────────────
// 2. All Documents Rejected (entire submission)
// ─────────────────────────────────────────────
const allRejectedTemplate = (user, reason) => ({
  subject: '❌ Your Documents Have Been Rejected',
  html: wrapper(`
    <h2 style="color:#dc2626;margin-top:0;">Your Documents Have Been Rejected</h2>
    <p>Hi <strong>${user.username || user.email}</strong>,</p>
    <p>Unfortunately, your submitted documents have been reviewed and <strong style="color:#dc2626;">rejected</strong>.</p>
    ${reason ? `
      <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px;border-radius:4px;margin:20px 0;">
        <strong style="color:#991b1b;">Reason:</strong>
        <p style="margin:8px 0 0;color:#7f1d1d;">${reason}</p>
      </div>
    ` : ''}
    <p>Please review the requirements and resubmit your documents.</p>
    <p style="margin-top:24px;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/documation"
         style="background:#dc2626;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
        Re-upload Documents
      </a>
    </p>
  `),
});

// ─────────────────────────────────────────────
// 3. Single Document Rejected
// ─────────────────────────────────────────────
const singleRejectedTemplate = (user, sectionKey, reason) => {
  const sectionLabel = sectionNames[sectionKey] || sectionKey;
  return {
    subject: `⚠️ Action Required: ${sectionLabel} Rejected`,
    html: wrapper(`
      <h2 style="color:#ea580c;margin-top:0;">Action Required</h2>
      <p>Hi <strong>${user.username || user.email}</strong>,</p>
      <p>One of your documents was rejected during review.</p>

      <div style="background:#fff7ed;border-left:4px solid #ea580c;padding:16px;border-radius:4px;margin:20px 0;">
        <p style="margin:0 0 8px;"><strong>Document:</strong> ${sectionLabel}</p>
        ${reason ? `<p style="margin:0;"><strong>Reason:</strong> ${reason}</p>` : ''}
      </div>

      <p>Please re-upload this document to complete your verification.</p>
      <p style="margin-top:24px;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/documation"
           style="background:#ea580c;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
          Re-upload Now
        </a>
      </p>
    `),
  };
};

module.exports = {
  allVerifiedTemplate,
  allRejectedTemplate,
  singleRejectedTemplate,
  sectionNames,
};