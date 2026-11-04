const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Application = require("../Models/Application");
const { sendApplicationEmail } = require("../utils/mailer");
const { decrypt } = require("../utils/encryption");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const ENCRYPTED_FIELDS = [
  "firstName", "lastName", "email", "phone", "linkedin", "companyTitle",
  "companyName", "website", "industry", "developmentStage", "businessModel",
  "country", "fundingType", "preMoneyValuation", "targetRaise", "annualRevenue",
  "offeringType", "description", "companyDescription", "productDescription",
];

// Create order
router.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 1179882, // ₹11,798.82 in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        product: "Startup Steroid Program",
        baseAmount: 9999,
        gst: 1799.82,
      },
    };
    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify payment signature and trigger email
router.post("/verify-payment", async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      applicationId 
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      
      // ✅ Payment verified successfully!
      // Now find the application and send the email
      if (applicationId) {
        const application = await Application.findById(applicationId);
        
        if (application) {
          // Decrypt the fields for the email
          const plain = { _id: application._id, status: application.status };
          for (const field of ENCRYPTED_FIELDS) {
            plain[field] = decrypt(application[field]);
          }

          // 📧 Send the email now that payment is confirmed
          sendApplicationEmail(plain, application.pitchDeck).catch((err) => {
            console.error("❌ Email sending failed after payment:", err.message);
          });
          
          // Update application status to paid
          application.status = "paid";
          await application.save();
        }
      }

      res.json({ success: true, message: "Payment verified and email sent." });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

module.exports = router;