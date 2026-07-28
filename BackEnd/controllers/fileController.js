const File = require('../models/File');
const { 
  upload, 
  getFileById, 
  deleteFile, 
  getFileMetadata,
  listUserFiles,
  countUserFiles,
  fileExists,
  getGridFSBucket
} = require('../config/gridfs');
const mongoose = require('mongoose');

// ============================================
// UPLOAD FILE
// ============================================
const uploadFile = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Create file metadata in database
    const file = new File({
      fileId: req.file.id,
      userId: req.user.id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      fileExtension: req.file.originalname.split('.').pop(),
      folder: req.body.folder || 'general',
      tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [],
      description: req.body.description || '',
      status: 'completed',
      metadata: req.body.metadata ? JSON.parse(req.body.metadata) : {}
    });

    await file.save();

    // Get file metadata from GridFS
    const metadata = await getFileMetadata(file.fileId);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        file: {
          id: file._id,
          fileId: file.fileId,
          name: file.originalName,
          size: file.fileSize,
          type: file.mimeType,
          folder: file.folder,
          tags: file.tags,
          description: file.description,
          uploadDate: file.createdAt
        },
        metadata: metadata
      }
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================================
// GET FILE (Stream to Browser)
// ============================================
const getFile = async (req, res) => {
  try {
    
    // Try to find by _id first, then by fileId
    let file = await File.findById(req.params.id);
    if (!file) {
      file = await File.findOne({ fileId: req.params.id });
    }
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check access permissions
    const hasAccess = await checkFileAccess(file, req.user);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get GridFS bucket instance
    const bucket = getGridFSBucket();
    if (!bucket) {
      console.error('❌ GridFS bucket not initialized');
      return res.status(500).json({
        success: false,
        message: 'Storage service unavailable'
      });
    }

    // Check if file exists in GridFS
    const exists = await fileExists(file.fileId);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'File not found in storage'
      });
    }

    // Increment view count
    await file.incrementViewCount();

    // Set response headers
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalName)}"`);
    res.setHeader('Content-Length', file.fileSize);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    // Stream file from GridFS
    const downloadStream = bucket.openDownloadStream(file.fileId);
    
    downloadStream.on('error', (err) => {
      console.error('❌ Stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error streaming file'
        });
      }
    });

    downloadStream.pipe(res);

  } catch (error) {
    console.error('❌ Get file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving file',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================================
// DOWNLOAD FILE (ONLY ONE)
// ============================================
const downloadFile = async (req, res) => {
  try {

    
    // Try to find by _id first, then by fileId
    let file = await File.findById(req.params.id);
    if (!file) {
      file = await File.findOne({ fileId: req.params.id });
    }
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const hasAccess = await checkFileAccess(file, req.user);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get GridFS bucket instance
    const bucket = getGridFSBucket();
    if (!bucket) {
      console.error('❌ GridFS bucket not initialized');
      return res.status(500).json({
        success: false,
        message: 'Storage service unavailable'
      });
    }

    const exists = await fileExists(file.fileId);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: 'File not found in storage'
      });
    }

    // Increment download count
    await file.incrementDownloadCount();

    // Set headers for download (force download)
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalName)}"`);
    res.setHeader('Content-Length', file.fileSize);

    // Stream file
    const downloadStream = bucket.openDownloadStream(file.fileId);
    
    downloadStream.on('error', (err) => {
      console.error('❌ Download stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error downloading file'
        });
      }
    });

    downloadStream.pipe(res);

  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading file',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================================
// GET FILE METADATA ONLY
// ============================================
const getFileMetadataOnly = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const hasAccess = await checkFileAccess(file, req.user);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const metadata = await getFileMetadata(file.fileId);

    res.status(200).json({
      success: true,
      data: {
        file: {
          id: file._id,
          fileId: file.fileId,
          name: file.originalName,
          size: file.fileSize,
          type: file.mimeType,
          folder: file.folder,
          tags: file.tags,
          description: file.description,
          uploadDate: file.createdAt,
          downloadCount: file.downloadCount,
          viewCount: file.viewCount,
          isPublic: file.isPublic,
          sharedWith: file.sharedWith
        },
        gridfsMetadata: metadata
      }
    });
  } catch (error) {
    console.error('❌ Get metadata error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving file metadata',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================================
// DELETE FILE
// ============================================
const deleteFileHandler = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check ownership
    if (file.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete from GridFS
    await deleteFile(file.fileId);

    // Soft delete from database
    await file.softDelete();

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================================
// LIST FILES
// ============================================
const listFiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const folder = req.query.folder || 'all';
    const search = req.query.search || '';

    let query = { userId: req.user.id, isDeleted: false };

    if (folder !== 'all') {
      query.folder = folder;
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { originalName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const total = await File.countDocuments(query);
    const files = await File.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get metadata for each file
    const filesWithMetadata = await Promise.all(
      files.map(async (file) => {
        try {
          const metadata = await getFileMetadata(file.fileId);
          return {
            ...file.toObject(),
            metadata
          };
        } catch {
          return file.toObject();
        }
      })
    );

    res.status(200).json({
      success: true,
      data: {
        files: filesWithMetadata,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('❌ List files error:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing files',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================================
// SHARE FILE
// ============================================
const shareFile = async (req, res) => {
  try {
    const { userId, accessLevel } = req.body;
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check ownership
    if (file.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can share this file'
      });
    }

    // Check if already shared
    const existingShare = file.sharedWith.find(
      share => share.userId.toString() === userId
    );

    if (existingShare) {
      existingShare.accessLevel = accessLevel || existingShare.accessLevel;
      existingShare.sharedAt = new Date();
    } else {
      file.sharedWith.push({
        userId,
        accessLevel: accessLevel || 'view',
        sharedAt: new Date()
      });
    }

    await file.save();

    res.status(200).json({
      success: true,
      message: 'File shared successfully',
      data: {
        sharedWith: file.sharedWith
      }
    });
  } catch (error) {
    console.error('❌ Share error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing file',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================================
// REMOVE SHARE
// ============================================
const removeShare = async (req, res) => {
  try {
    const { userId } = req.params;
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check ownership
    if (file.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can manage sharing'
      });
    }

    file.sharedWith = file.sharedWith.filter(
      share => share.userId.toString() !== userId
    );

    await file.save();

    res.status(200).json({
      success: true,
      message: 'Share removed successfully',
      data: {
        sharedWith: file.sharedWith
      }
    });
  } catch (error) {
    console.error('❌ Remove share error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing share',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================================
// GET FILE PREVIEW (Images & PDFs)
// ============================================
const getFilePreview = async (req, res) => {
  try {
  
    
    // First, try to find the file by its database ID
    let file = await File.findById(req.params.id);
    
    // If not found by _id, try by fileId
    if (!file) {

      file = await File.findOne({ fileId: req.params.id });
    }
    
    if (!file) {
      console.error('❌ File not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

  

    // Check access permissions
    const hasAccess = await checkFileAccess(file, req.user);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get GridFS bucket instance
    const bucket = getGridFSBucket();
    if (!bucket) {
      console.error('❌ GridFS bucket not initialized');
      return res.status(500).json({
        success: false,
        message: 'Storage service unavailable'
      });
    }

    // Check if the file exists in GridFS
    const exists = await fileExists(file.fileId);
    if (!exists) {
      console.error('❌ File not found in GridFS:', file.fileId);
      return res.status(404).json({
        success: false,
        message: 'File not found in storage'
      });
    }

    // Check if previewable (images and PDFs)
    const previewableTypes = ['image/', 'application/pdf'];
    const isPreviewable = previewableTypes.some(type => file.mimeType.startsWith(type));

    if (!isPreviewable) {
      return res.status(400).json({
        success: false,
        message: `Preview not available for ${file.mimeType} files. Only images and PDFs are supported.`
      });
    }

    // Set response headers for preview
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalName)}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    
    // Stream file from GridFS
    const downloadStream = bucket.openDownloadStream(file.fileId);
    
    downloadStream.on('error', (err) => {
      console.error('❌ Preview stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error generating preview',
          error: err.message
        });
      }
    });

    downloadStream.pipe(res);

  } catch (error) {
    console.error('❌ Preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating preview',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================================
// HELPER: Check File Access
// ============================================
const checkFileAccess = async (file, user) => {
  // Owner has full access
  if (file.userId.toString() === user.id) {
    return true;
  }

  // Admin has access
  if (user.role === 'admin') {
    return true;
  }

  // Check shared access
  if (file.sharedWith && file.sharedWith.length > 0) {
    const shared = file.sharedWith.find(
      share => share.userId.toString() === user.id
    );
    if (shared) return true;
  }

  // Check if file is public
  if (file.isPublic) {
    return true;
  }

  return false;
};
// ============================================
// ADMIN: GET ALL FILES (All Users)
// ============================================
const adminGetAllFiles = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || '';
    const folder = req.query.folder || 'all';
    const userId = req.query.userId || 'all';

    let query = { isDeleted: false };

    if (folder !== 'all') {
      query.folder = folder;
    }

    if (userId !== 'all') {
      query.userId = userId;
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { originalName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { fileName: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const total = await File.countDocuments(query);
    const files = await File.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'username email name');

    // Get GridFS metadata for each file
    const filesWithMetadata = await Promise.all(
      files.map(async (file) => {
        try {
          const metadata = await getFileMetadata(file.fileId);
          return {
            ...file.toObject(),
            gridfsMetadata: metadata
          };
        } catch {
          return file.toObject();
        }
      })
    );

    res.status(200).json({
      success: true,
      data: {
        files: filesWithMetadata,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('❌ Admin get all files error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching files',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================================
// ADMIN: GET FILE STATISTICS
// ============================================
const adminGetStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const totalFiles = await File.countDocuments({ isDeleted: false });
    const totalUsers = await mongoose.model('User').countDocuments();
    const filesByFolder = await File.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$folder', count: { $sum: 1 } } }
    ]);
    const filesByUser = await File.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$userId', count: { $sum: 1 } } }
    ]);
    
    // Get total size
    const files = await File.find({ isDeleted: false }).select('fileSize');
    const totalSize = files.reduce((acc, file) => acc + (file.fileSize || 0), 0);

    // Recent uploads (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUploads = await File.countDocuments({
      isDeleted: false,
      createdAt: { $gte: last24Hours }
    });

    res.status(200).json({
      success: true,
      data: {
        totalFiles,
        totalUsers,
        totalSize: totalSize,
        totalSizeFormatted: formatFileSize(totalSize),
        recentUploads,
        filesByFolder,
        filesByUser,
        averageFileSize: totalFiles > 0 ? formatFileSize(totalSize / totalFiles) : '0 Bytes'
      }
    });
  } catch (error) {
    console.error('❌ Admin get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============================================
// ADMIN: DELETE ANY FILE
// ============================================
const adminDeleteFile = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete from GridFS
    await deleteFile(file.fileId);

    // Hard delete from database
    await file.deleteOne();

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('❌ Admin delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Add to exports
module.exports = {
  uploadFile,
  getFile,
  downloadFile,
  getFileMetadataOnly,
  deleteFileHandler,
  listFiles,
  shareFile,
  removeShare,
  getFilePreview,
  adminGetAllFiles,  // Add this
  adminGetStats,     // Add this
  adminDeleteFile    // Add this
};
