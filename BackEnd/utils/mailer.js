const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Reuse a single SMTP transport (connection pooling)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE) === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true,
  maxConnections: 3,
  maxMessages: 50,
});

/**
 * Send application notification email with pitch deck attachments.
 * @param {Object} application - The saved Mongoose application document
 * @param {Array} files - Array of multer file objects (req.files)
 */
async function sendApplicationEmail(application, files = []) {
  const receiver =
    process.env.APPLICATION_RECEIVER_EMAIL || process.env.SMTP_USER;

  // Build attachments from uploaded files
  const attachments = files.map((file) => {
    // Multer stores file.path on disk (e.g. "uploads/1698...-abc.pdf")
    const filePath = path.resolve(file.path);
    return {
      filename: file.originalname || file.filename, // keep original name for the recipient
      path: filePath,
      contentType: file.mimetype,
    };
  });

  // Simple HTML body (ciphertext-decrypted fields are already in `application`)
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #333;">
      <h2 style="color: #2563eb;">New Startup Application</h2>
      <p>A new startup application was submitted on your platform.</p>

      <table cellpadding="6" cellspacing="0" border="1"
             style="border-collapse: collapse; width: 100%; font-size: 14px;">
        <tr><td><strong>Reference ID</strong></td><td>${application._id}</td></tr>
        <tr><td><strong>Name</strong></td><td>${application.firstName} ${application.lastName}</td></tr>
        <tr><td><strong>Email</strong></td><td>${application.email}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${application.phone}</td></tr>
        <tr><td><strong>LinkedIn</strong></td><td>${application.linkedin}</td></tr>
        <tr><td><strong>Title</strong></td><td>${application.companyTitle}</td></tr>
        <tr><td><strong>Company</strong></td><td>${application.companyName}</td></tr>
        <tr><td><strong>Website</strong></td><td>${application.website}</td></tr>
        <tr><td><strong>Industry</strong></td><td>${application.industry}</td></tr>
        <tr><td><strong>Stage</strong></td><td>${application.developmentStage}</td></tr>
        <tr><td><strong>Business Model</strong></td><td>${application.businessModel}</td></tr>
        <tr><td><strong>Country</strong></td><td>${application.country}</td></tr>
        <tr><td><strong>Funding Type</strong></td><td>${application.fundingType}</td></tr>
        <tr><td><strong>Pre-Money Valuation</strong></td><td>${application.preMoneyValuation}</td></tr>
        <tr><td><strong>Target Raise</strong></td><td>${application.targetRaise}</td></tr>
        <tr><td><strong>Annual Revenue</strong></td><td>${application.annualRevenue}</td></tr>
        <tr><td><strong>Offering Type</strong></td><td>${application.offeringType}</td></tr>
      </table>

      <h3 style="color: #2563eb; margin-top: 24px;">Descriptions</h3>
      <p><strong>Description:</strong><br/>${application.description}</p>
      <p><strong>Company Description:</strong><br/>${application.companyDescription}</p>
      <p><strong>Product/Service Description:</strong><br/>${application.productDescription}</p>

      <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">
        Pitch deck files are attached (${attachments.length} file${attachments.length === 1 ? "" : "s"}).
      </p>
    </div>
  `;

  const text = `
New Startup Application
Reference ID: ${application._id}
Name: ${application.firstName} ${application.lastName}
Email: ${application.email}
Phone: ${application.phone}
Company: ${application.companyName}
Industry: ${application.industry}
Stage: ${application.developmentStage}
Funding Type: ${application.fundingType}
Target Raise: ${application.targetRaise}
Attachments: ${attachments.length} file(s)
  `.trim();

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: receiver,
    replyTo: application.email,
    subject: `🚀 New Startup Application — ${application.companyName} (${application.firstName} ${application.lastName})`,
    text,
    html,
    attachments,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("📧 Email sent:", info.messageId, "→", receiver);
  return info;
}

module.exports = { sendApplicationEmail };