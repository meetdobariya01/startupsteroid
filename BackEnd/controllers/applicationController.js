const Application = require("../Models/Application");
const { encrypt, decrypt } = require("../utils/encryption");

const ENCRYPTED_FIELDS = [
  "firstName", "lastName", "email", "phone", "linkedin", "companyTitle",
  "companyName", "website", "industry", "developmentStage", "businessModel",
  "country", "fundingType", "preMoneyValuation", "targetRaise", "annualRevenue",
  "offeringType", "description", "companyDescription", "productDescription",
];

// ─── SUBMIT APPLICATION (SAVE ONLY) ───────────────────────
exports.createApplication = async (req, res, next) => {
  try {
    const body = req.body || {};
    const missing = ENCRYPTED_FIELDS.filter((f) => !body[f] || String(body[f]).trim() === "");
    
    if (missing.length) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Pitch deck is required" });
    }

    const encryptedDoc = { user: req.user._id };
    for (const field of ENCRYPTED_FIELDS) {
      encryptedDoc[field] = encrypt(String(body[field]).trim());
    }

    encryptedDoc.pitchDeck = req.files.map((f) => ({
      originalName: f.originalname, storedName: f.filename,
      path: f.path, size: f.size, mimetype: f.mimetype,
    }));

    const saved = await Application.create(encryptedDoc);

    res.status(201).json({
      message: "Application saved. Proceeding to payment.",
      applicationId: saved._id,
      status: saved.status,
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET MY APPLICATIONS ────────────────────────────────
exports.getMyApplications = async (req, res, next) => {
  try {
    const apps = await Application.find({ user: req.user._id }).sort("-createdAt");
    const decrypted = apps.map((app) => {
      const obj = app.toObject();
      for (const field of ENCRYPTED_FIELDS) {
        obj[field] = decrypt(obj[field]);
      }
      return obj;
    });
    res.json({ applications: decrypted });
  } catch (err) {
    next(err);
  }
};

// ─── GET SINGLE ─────────────────────────────────────────
exports.getApplicationById = async (req, res, next) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    const isOwner = app.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const obj = app.toObject();
    for (const field of ENCRYPTED_FIELDS) {
      obj[field] = decrypt(obj[field]);
    }
    res.json({ application: obj });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: LIST ALL ────────────────────────────────────
exports.listAll = async (req, res, next) => {
  try {
    const apps = await Application.find()
      .select("user status pitchDeck createdAt updatedAt")
      .sort("-createdAt");
    res.json({ applications: apps });
  } catch (err) {
    next(err);
  }
};