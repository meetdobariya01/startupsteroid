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
  getFilePreview
} = require('../controllers/fileController');

// All routes are protected
router.use(authMiddleware);

// UPLOAD ROUTES
router.post('/upload', upload().single('file'), uploadFile);

// LIST ROUTES
router.get('/', listFiles);

// SINGLE FILE ROUTES
router.get('/:id/metadata', getFileMetadataOnly);
router.get('/:id/preview', getFilePreview);
router.get('/:id', getFile);
router.get('/:id/download', downloadFile);

// SHARING ROUTES
router.post('/:id/share', shareFile);
router.delete('/:id/share/:userId', removeShare);

// DELETE ROUTE
router.delete('/:id', deleteFileHandler);

module.exports = router;