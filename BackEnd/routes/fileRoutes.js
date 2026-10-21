// routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { upload } = require('../config/gridfs');

const {
  uploadFile,
  getFile,
  downloadFile,
  getFileMetadataOnly,
  deleteFileHandler,
  listFiles,
  shareFile,
  removeShare,
  getFilePreview,
  adminGetAllFiles,
  adminGetStats,
  adminDeleteFile,
} = require('../controllers/fileController');

// All routes are protected
router.use(authMiddleware);

// ─────────────────────────────────────────────
// UPLOAD
// ─────────────────────────────────────────────
router.post('/upload', upload().single('file'), uploadFile);

// ─────────────────────────────────────────────
// LIST
// ─────────────────────────────────────────────
router.get('/', listFiles);

// ─────────────────────────────────────────────
// ADMIN ROUTES — MUST be before dynamic /:id routes
// ─────────────────────────────────────────────
router.get('/admin/stats', adminGetStats);
router.get('/admin/all', adminGetAllFiles);
router.delete('/admin/:id', adminDeleteFile);

// ─────────────────────────────────────────────
// SINGLE FILE ROUTES — ORDER MATTERS!
// ─────────────────────────────────────────────
router.get('/:id/metadata', getFileMetadataOnly);
router.get('/:id/preview', getFilePreview);
router.get('/:id/download', downloadFile);
router.get('/:id', getFile);

// ─────────────────────────────────────────────
// SHARING ROUTES
// ─────────────────────────────────────────────
router.post('/:id/share', shareFile);
router.delete('/:id/share/:userId', removeShare);

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────
router.delete('/:id', deleteFileHandler);

module.exports = router;