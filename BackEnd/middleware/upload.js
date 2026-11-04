const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const UPLOAD_DIR = path.resolve(
  __dirname,
  "..",
  process.env.UPLOAD_DIR || "uploads"
);
const MAX_MB = Number(process.env.MAX_FILE_SIZE_MB || 15);

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = [".pdf", ".ppt", ".pptx"].includes(ext) ? ext : ".pdf";
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${safeExt}`);
  },
});

const ALLOWED_MIME = [
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const upload = multer({
  storage,
  limits: { fileSize: MAX_MB * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(new Error("Only PDF, PPT, PPTX files are allowed"));
    }
    cb(null, true);
  },
});

module.exports = upload;
